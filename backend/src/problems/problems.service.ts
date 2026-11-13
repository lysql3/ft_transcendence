import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProblemDto } from './dto/create-problem.dto.js';
import { UpdateProblemDto } from './dto/update-problem.dto.js';

@Injectable()
export class ProblemsService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return this.prisma.problem.findMany({ orderBy: { createdAt: 'desc' } });
	}

	async findOne(id: number) {
		const problem = await this.prisma.problem.findUnique({ where: { id } });
		if (!problem) {
			throw new NotFoundException(`Problem with ID ${id} not found`);
		}
		return problem;
	}

	async create(data: CreateProblemDto) {
		return this.prisma.problem.create({ data });
	}

	async update(id: number, data: UpdateProblemDto) {
		return this.prisma.problem.update({ where: { id }, data });
	}

	async remove(id: number) {
		const problem = await this.prisma.problem.findUnique({ where: { id } });
		if (!problem) {
			throw new NotFoundException(`Problem with ID ${id} not found`);
		}
		return this.prisma.problem.delete({ where: { id } });
	}

	async getTestCases(problemId: number) {
		return this.prisma.testCase.findMany({ where: { problemId } });
	}
}

