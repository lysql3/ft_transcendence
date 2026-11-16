// src/problem/problem.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ProblemService } from './problem.service.js';
import { CreateProblemDto } from './dto/create-problem.dto.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post('create')
  @AllowAnonymous()
  create(@Body() dto: CreateProblemDto) {
    return this.problemService.create(dto.path);
  }
}
