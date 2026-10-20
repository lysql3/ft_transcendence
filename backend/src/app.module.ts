import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './logger.config.js';

@Module({
  imports: [
    HealthModule,
    PrismaModule,
    UsersModule,
    LoggerModule.forRoot(loggerConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
