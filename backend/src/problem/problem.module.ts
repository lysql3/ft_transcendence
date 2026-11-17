import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller.js';
import { ProblemService } from './problem.service.js';
// import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  // imports: [PrismaModule],
  controllers: [ProblemController],
  providers: [ProblemService],
})
export class ProblemModule {}
