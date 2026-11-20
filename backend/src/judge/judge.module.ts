import { Module } from '@nestjs/common';
import { JudgeController } from './judge.controller.js';
import { JudgeService } from './judge.service.js';

@Module({
	controllers: [JudgeController],
	providers: [JudgeService],
	exports: [JudgeService],
})
export class JudgeModule {}
