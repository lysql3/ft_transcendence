import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLanguageDto } from './dto/create-language.dto.js';

@Injectable()
export class LanguageService {
	constructor(private readonly prisma: PrismaService) {}

	findAll() {
		return this.prisma.language.findMany({ orderBy: { name: 'asc' } });
	}

	async create(dto: CreateLanguageDto) {
		const existing = await this.prisma.language.findUnique({ where: { name: dto.name } });
		if (existing) throw new ConflictException(`Language "${dto.name}" already exists`);

		return this.prisma.language.create({ data: { name: dto.name } });
	}

	async remove(id: number) {
		const language = await this.prisma.language.findUnique({
			where: { id },
			include: { _count: { select: { submissions: true } } },
		});
		if (!language) throw new NotFoundException(`Language ${id} not found`);

		if (language._count.submissions > 0) {
			throw new ConflictException(`Language ${id} is used by submissions and cannot be deleted`);
		}

		await this.prisma.language.delete({ where: { id } });
		return { message: `Language ${id} deleted` };
	}
}
