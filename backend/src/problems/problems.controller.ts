import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProblemsService } from './problems.service.js';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  findAll() {
    return this.problemsService.findAll();
  }

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
	  return this.problemsService.findOne(id);
	}
}
