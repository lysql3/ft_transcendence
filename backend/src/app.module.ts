import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    HealthModule,
    PrismaModule,
    UsersModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,

        genReqId: (_req, res) => {
          const id = randomUUID();
          res.setHeader('X-Request-Id', id);
          return id;
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
