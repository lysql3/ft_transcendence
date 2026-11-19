import {
	Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ProblemService } from './problem.service.js';
import { CreateProblemDto, TestCaseFieldsDto } from './dto/create-problem.dto.js';
import { ListProblemsQueryDto } from './dto/list-problems-query.dto.js';
import { UpdateProblemFieldsDto } from './dto/update-problem.dto.js';

@Controller('problem')
export class ProblemController {
	constructor(private readonly problemService: ProblemService) {}

	@AllowAnonymous() // test only, remove before production
	@Get()
	findAll(@Query() query: ListProblemsQueryDto) {
		return this.problemService.findAll(query);
	}

	@AllowAnonymous() // test only
	@Get(':slug')
	findOne(@Param('slug') slug: string) {
		return this.problemService.findOneBySlug(slug);
	}

	@AllowAnonymous() // test only
	@Post()
	createFromFields(@Body() dto: CreateProblemDto) {
		return this.problemService.create(dto);
	}

	@AllowAnonymous() // test only
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProblemFieldsDto) {
		return this.problemService.update(id, dto);
	}

	@AllowAnonymous() // test only
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.problemService.remove(id);
	}

	@AllowAnonymous() // test only
	@Post(':id/tests')
	addTestCase(@Param('id', ParseIntPipe) id: number, @Body() dto: TestCaseFieldsDto) {
		return this.problemService.addTestCase(id, dto);
	}

	@AllowAnonymous() // test only
	@Delete(':id/tests/:testId')
	removeTestCase(
		@Param('id', ParseIntPipe) id: number,
		@Param('testId', ParseIntPipe) testId: number,
	) {
		return this.problemService.removeTestCase(id, testId);
	}
}
