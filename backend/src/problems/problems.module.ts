import { Module } from '@nestjs/common';
import { ProblemsController } from './problems.controller.js';
import { ProblemsService } from './problems.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProblemsController],
  providers: [ProblemsService]
})
export class ProblemsModule {}
