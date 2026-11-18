import { Body, Controller, Post } from '@nestjs/common';
import { ProblemService } from './problem.service.js';
import { CreateProblemDto } from './dto/create-problem.dto.js';
import { CreateProblemFieldsDto } from './dto/create-problem-fields.dto.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('problem')
export class ProblemController {
	constructor(private readonly problemService: ProblemService) {}

	@Post('create')
	createFromFolder(@Body() dto: CreateProblemDto) {
		return this.problemService.create(dto.path);
	}

	@AllowAnonymous()
	@Post()
	createFromFields(@Body() dto: CreateProblemFieldsDto) {
		return this.problemService.createFromFields(dto);
	}
}
