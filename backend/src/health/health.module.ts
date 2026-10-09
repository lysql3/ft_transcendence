import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { DATABASE_POOL, HealthService } from './health.service.js';
import { Pool } from 'pg';

@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: DATABASE_POOL,
      useFactory: () =>
        new Pool({ connectionString: process.env.DATABASE_URL }),
    },
    HealthService,
  ],
})
export class HealthModule {}
