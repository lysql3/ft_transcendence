import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { EventsModule } from './events/events.module.js';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './logger.config.js';
import { ProblemsModule } from './problems/problems.module.js';
import { LanguagesModule } from './languages/languages.module.js';
import { SubmissionsModule } from './submissions/submissions.module.js';

@Module({
  imports: [
    HealthModule,
    PrismaModule,
    UsersModule,
    EventsModule,
    LoggerModule.forRoot(loggerConfig),
    ProblemsModule,
    LanguagesModule,
    SubmissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
