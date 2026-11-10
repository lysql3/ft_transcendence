import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js'
import { CreateSubmissionDto } from './dto/create-submission.dto.js';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateSubmissionDto) {
	  try {
	    return await this.prisma.submission.create({
	      data: {
	        userId: dto.userId,
	        problemId: dto.problemId,
	        languageId: dto.languageId,
	        codeContent: dto.codeContent,
	        status: 'pending',
	      },
	    });
	  } catch (error) {
	    if (error instanceof Prisma.PrismaClientKnownRequestError
					&& error.code === 'P2003')
	      throw new BadRequestException('User, problem, or language does not exist');

	    throw error;
	  }
	}

	async findAll() {
		return this.prisma.submission.findMany({
			orderBy: { createdAt: 'desc'},
		});
	}

	async findOne(id: number) {
	  const submission = await this.prisma.submission.findUnique({
	    where: { id },
	  });

	  if (submission === null) {
	    throw new NotFoundException('Submission not found');
	  }

	  return submission;
	}
}
