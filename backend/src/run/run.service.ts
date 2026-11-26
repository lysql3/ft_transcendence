import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JudgeService } from '../judge/judge.service.js';
import { JUDGE_LANGUAGE_IDS } from '../judge/judge-languages.js';
import { RunCodeDto } from './dto/run-code.dto.js';

@Injectable()
export class RunService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly judge: JudgeService,
	) {}

	async run(dto: RunCodeDto) {
		const language = await this.prisma.language.findUnique({
			where: { id: dto.languageId },
		});
		if (!language) throw new BadRequestException(`Language ${dto.languageId} not found`);

		const judgeLanguageId = JUDGE_LANGUAGE_IDS[language.name];
		if (!judgeLanguageId) {
			throw new BadRequestException(`Language "${language.name}" is not supported`);
		}

		const result = await this.judge.execute({
			sourceCode: dto.code,
			languageId: judgeLanguageId,
			stdin: dto.stdin ?? '',
			cpuTimeLimit: 5,
			memoryLimit: 256000,
		});

		return {
			status: result.status,
			stdout: result.stdout,
			stderr: result.stderr,
			compileOutput: result.compileOutput,
			time: result.time,
			memory: result.memory,
		};
	}
}
