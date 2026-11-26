import { Module } from '@nestjs/common';
import { RunController } from './run.controller.js';
import { RunService } from './run.service.js';
import { JudgeModule } from '../judge/judge.module.js';

@Module({
	imports: [JudgeModule],
	controllers: [RunController],
	providers: [RunService],
})
export class RunModule {}
