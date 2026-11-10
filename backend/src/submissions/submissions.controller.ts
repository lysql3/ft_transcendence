import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { CreateSubmissionDto } from './dto/create-submission.dto.js';

@Controller('submissions')
export class SubmissionsController {
  constructor(
    private readonly submissionsService: SubmissionsService,
  ) {}

  @Post()
  create(@Body() data: CreateSubmissionDto) {
    return this.submissionsService.create(data);
  }

	@Get()
	findAll() {
		return this.submissionsService.findAll();
	}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.submissionsService.findOne(id);
  }
}
