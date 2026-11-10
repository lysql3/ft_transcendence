import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProblemsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll()
  {
    return this.prisma.problem.findMany({
      orderBy: { createdAt: 'desc' }, // 'desc': newest first.
    });
  }

  async findOne(id: number)
  {
    const problem = await this.prisma.problem.findUnique({ where: { id }, });
    if (!problem)
      throw new NotFoundException('Problem not found');
    return problem;
  }
}
