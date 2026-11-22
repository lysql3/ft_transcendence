import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import { SubmissionService } from './submission.service.js';
import { CreateSubmissionDto } from './dto/create-submission.dto.js';

@Controller('submission')
export class SubmissionController {
	constructor(private readonly submissionService: SubmissionService) {}

	@Post()
	create(@Session() session: { user: { id: string } }, @Body() dto: CreateSubmissionDto) {
		return this.submissionService.create(session.user.id, dto);
	}

	@Get()
	findMine(
		@Session() session: { user: { id: string } },
		@Query('problemId') problemId?: string,
	) {
		return this.submissionService.findMine(session.user.id, problemId ? Number(problemId) : undefined);
	}

	@Get(':id')
	findOne(
		@Session() session: { user: { id: string } },
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.submissionService.findOne(id, session.user.id);
	}
}
