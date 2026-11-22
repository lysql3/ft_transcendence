import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller.js';
import { SubmissionService } from './submission.service.js';
import { ProblemModule } from '../problem/problem.module.js';
import { JudgeModule } from '../judge/judge.module.js';
import { EventsModule } from '../events/events.module.js';

@Module({
	imports: [ProblemModule, JudgeModule, EventsModule],
	controllers: [SubmissionController],
	providers: [SubmissionService],
})
export class SubmissionModule {}
