import { Module } from '@nestjs/common';
import { SubmissionsController } from './submissions.controller.js';
import { SubmissionsService } from './submissions.service.js';
import { PrismaModule } from '../prisma/prisma.module.js'

@Module({
  imports: [PrismaModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService]
})
export class SubmissionsModule {}
