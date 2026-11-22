import { randomUUID } from 'crypto';
import { mkdir,readFile, writeFile, rm } from 'fs/promises';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProblemDto } from './dto/create-problem.dto.js';
import { ListProblemsQueryDto } from './dto/list-problems-query.dto.js';
import { UpdateProblemFieldsDto } from './dto/update-problem.dto.js';
import { TestCaseFieldsDto } from './dto/create-problem.dto.js';
import {
	ConflictException,
	NotFoundException,
	BadRequestException,
	Injectable
} from '@nestjs/common';
import { basename, dirname, join } from 'path/posix';
import type { Prisma } from '../generated/prisma/client.js';

const DATA_DIR = join(process.cwd(), 'data');

@Injectable()
export class ProblemService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateProblemDto) {
		const existing = await this.prisma.problem.findUnique({
			where: { slug: dto.slug },
		});
		if (existing) {
			throw new BadRequestException(`Slug "${dto.slug}" already exists`);
		}

		const folder = `problems/${randomUUID()}`;
		const absFolder = join(DATA_DIR, folder);

		try {
			await mkdir(join(absFolder, 'tests'), { recursive: true });
			await writeFile(join(absFolder, 'description.md'), dto.description, 'utf-8');

			for (const [i, tc] of dto.testCases.entries()) {
				const n = i + 1;
				await writeFile(join(absFolder, 'tests', `${n}.in`), tc.input, 'utf-8');
				await writeFile(join(absFolder, 'tests', `${n}.out`), tc.expectedOutput, 'utf-8');
			}

			return await this.prisma.problem.create({
				data: {
					title: dto.title,
					slug: dto.slug,
					tags: dto.tags,
					difficulty: dto.difficulty,
					descriptionPath: `${folder}/description.md`,
					testCases: {
						create: dto.testCases.map((tc, i) => ({
							inputPath: `${folder}/tests/${i + 1}.in`,
							outputPath: `${folder}/tests/${i + 1}.out`,
							isHidden: tc.isHidden ?? true,
						})),
					},
				},
				include: { testCases: true },
			});
		} catch (e) {
			await rm(absFolder, { recursive: true, force: true });
			throw e;
		}
	}

	async findAll(query: ListProblemsQueryDto) {
		const page = query.page ?? 1;
		const limit = query.limit ?? 20;

		const where: Prisma.ProblemWhereInput = {};
		if (query.difficulty) where.difficulty = query.difficulty;
		if (query.tag) where.tags = { has: query.tag };

		const [items, total] = await this.prisma.$transaction([
			this.prisma.problem.findMany({
				where,
				select: { id: true, title: true, slug: true, difficulty: true, tags: true, createdAt: true },
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit,
			}),
			this.prisma.problem.count({ where }),
		]);

		return { items, total, page, limit };
	}

	async findOneBySlug(slug: string) {
		const problem = await this.prisma.problem.findUnique({
			where: { slug },
			include: { testCases: { orderBy: { id: 'asc' } } },
		});
		if (!problem) throw new NotFoundException(`Problem "${slug}" not found`);

		const { descriptionPath, testCases, ...meta } = problem;
		const visible = testCases.filter((tc) => !tc.isHidden);

		return {
			...meta,
			description: await readFile(join(DATA_DIR, descriptionPath), 'utf-8'),
			// only visible tests are exposed, hidden ones never leave the server
			visibleTestCases: await Promise.all(
				visible.map(async (tc) => ({
					id: tc.id,
					input: await readFile(join(DATA_DIR, tc.inputPath), 'utf-8'),
					expectedOutput: await readFile(join(DATA_DIR, tc.outputPath), 'utf-8'),
				})),
			),
			hiddenTestCount: testCases.length - visible.length,
		};
	}

	async loadAllTestCases(problemId: number) {
		const testCases = await this.prisma.testCase.findMany({
			where: { problemId },
			orderBy: { id: 'asc' },
		});

		return Promise.all(
			testCases.map(async (tc) => ({
				id: tc.id,
				isHidden: tc.isHidden,
				input: await readFile(join(DATA_DIR, tc.inputPath), 'utf-8'),
				expectedOutput: await readFile(join(DATA_DIR, tc.outputPath), 'utf-8'),
			})),
		);
	}

	async update(id: number, dto: UpdateProblemFieldsDto) {
		const problem = await this.findById(id);

		const data: Prisma.ProblemUpdateInput = {};
		if (dto.title !== undefined) data.title = dto.title;
		if (dto.difficulty !== undefined) data.difficulty = dto.difficulty;
		if (dto.tags !== undefined) data.tags = dto.tags;

		if (dto.description !== undefined) {
			await writeFile(join(DATA_DIR, problem.descriptionPath), dto.description, 'utf-8');
		}

		return this.prisma.problem.update({
			where: { id },
			data,
			include: { testCases: true },
		});
	}

	async remove(id: number) {
		const problem = await this.prisma.problem.findUnique({
			where: { id },
			include: { _count: { select: { submissions: true, matches: true } } },
		});
		if (!problem) throw new NotFoundException(`Problem ${id} not found`);

		if (problem._count.submissions > 0 || problem._count.matches > 0) {
			throw new ConflictException(
				`Problem ${id} is used by submissions or matches and cannot be deleted`,
			);
		}

		await this.prisma.problem.delete({ where: { id } });
		await rm(join(DATA_DIR, dirname(problem.descriptionPath)), { recursive: true, force: true });

		return { message: `Problem ${id} deleted` };
	}

	async addTestCase(problemId: number, dto: TestCaseFieldsDto) {
		const problem = await this.findById(problemId);
		const folder = dirname(problem.descriptionPath);

		const existing = await this.prisma.testCase.findMany({
			where: { problemId },
			select: { inputPath: true },
		});
		const next =
			Math.max(0, ...existing.map((tc) => Number(basename(tc.inputPath, '.in')))) + 1;

		const inputPath = `${folder}/tests/${next}.in`;
		const outputPath = `${folder}/tests/${next}.out`;

		await mkdir(join(DATA_DIR, folder, 'tests'), { recursive: true });
		await writeFile(join(DATA_DIR, inputPath), dto.input, 'utf-8');
		await writeFile(join(DATA_DIR, outputPath), dto.expectedOutput, 'utf-8');

		return this.prisma.testCase.create({
			data: {
				problemId,
				inputPath,
				outputPath,
				isHidden: dto.isHidden ?? true,
			},
		});
	}

	async removeTestCase(problemId: number, testCaseId: number) {
		await this.findById(problemId);

		const testCase = await this.prisma.testCase.findFirst({
			where: { id: testCaseId, problemId },
		});
		if (!testCase) throw new NotFoundException(`Test case ${testCaseId} not found`);

		const count = await this.prisma.testCase.count({ where: { problemId } });
		if (count <= 1) {
			throw new BadRequestException('A problem must keep at least one test case');
		}

		await this.prisma.testCase.delete({ where: { id: testCaseId } });
		await rm(join(DATA_DIR, testCase.inputPath), { force: true });
		await rm(join(DATA_DIR, testCase.outputPath), { force: true });

		return { message: `Test case ${testCaseId} deleted` };
	}

	private async findById(id: number) {
		const problem = await this.prisma.problem.findUnique({ where: { id } });
		if (!problem) throw new NotFoundException(`Problem ${id} not found`);
		return problem;
	}
}
