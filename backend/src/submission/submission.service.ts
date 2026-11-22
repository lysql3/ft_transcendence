import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProblemService } from '../problem/problem.service.js';
import { JudgeService, JudgeStatus } from '../judge/judge.service.js';
import { EventsGateway } from '../events/events.gateway.js';
import { CreateSubmissionDto } from './dto/create-submission.dto.js';

const JUDGE_LANGUAGE_IDS: Record<string, number> = {
	python: 71,
	cpp: 54,
	javascript: 63,
};

@Injectable()
export class SubmissionService {
	private readonly logger = new Logger(SubmissionService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly problems: ProblemService,
		private readonly judge: JudgeService,
		private readonly events: EventsGateway,
	) {}

	async create(userId: string, dto: CreateSubmissionDto) {
		const judgeLanguageId = await this.resolveJudgeLanguage(dto.languageId);
		await this.ensureProblemExists(dto.problemId);

		const submission = await this.prisma.submission.create({
			data: {
				userId,
				problemId: dto.problemId,
				languageId: dto.languageId,
				codeContent: dto.code,
				status: 'pending',
			},
		});

		void this.judgeInBackground(submission.id, userId, dto.code, judgeLanguageId, dto.problemId);

		return submission;
	}

	async findOne(id: number, userId: string) {
		const submission = await this.prisma.submission.findFirst({ where: { id, userId } });
		if (!submission) throw new NotFoundException(`Submission ${id} not found`);
		return submission;
	}

	findMine(userId: string, problemId?: number) {
		return this.prisma.submission.findMany({
			where: { userId, ...(problemId ? { problemId } : {}) },
			orderBy: { createdAt: 'desc' },
		});
	}

	private async judgeInBackground(
		submissionId: number,
		userId: string,
		code: string,
		judgeLanguageId: number,
		problemId: number,
	) {
		let final: JudgeStatus = 'accepted';

		try {
			const tests = await this.problems.loadAllTestCases(problemId);

			for (const tc of tests) {
				const r = await this.judge.execute({
					sourceCode: code,
					languageId: judgeLanguageId,
					stdin: tc.input,
				});

				if (r.status !== 'accepted') {
					final = r.status;
					break;
				}
				if (!this.judge.matches(r.stdout, tc.expectedOutput)) {
					final = 'wrong_answer';
					break;
				}
			}
		} catch (e) {
			this.logger.error(`Judging submission ${submissionId} failed`, (e as Error).stack);
			final = 'internal_error';
		}

		await this.prisma.submission.update({
			where: { id: submissionId },
			data: { status: final },
		});

		this.notify(userId, { id: submissionId, status: final });
	}

	private notify(userId: string, payload: { id: number; status: string }) {
		this.events.server.to(`user:${userId}`).emit('submission:updated', payload);
	}

	private async resolveJudgeLanguage(languageId: number): Promise<number> {
		const language = await this.prisma.language.findUnique({ where: { id: languageId } });
		if (!language) throw new BadRequestException(`Language ${languageId} not found`);

		const judgeId = JUDGE_LANGUAGE_IDS[language.name];
		if (!judgeId) throw new BadRequestException(`Language "${language.name}" is not supported`);
		return judgeId;
	}

	private async ensureProblemExists(problemId: number) {
		const exists = await this.prisma.problem.findUnique({ where: { id: problemId } });
		if (!exists) throw new NotFoundException(`Problem ${problemId} not found`);
	}
}
