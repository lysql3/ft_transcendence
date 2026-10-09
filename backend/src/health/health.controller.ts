import { Controller, Delete, Get, Post } from '@nestjs/common';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check() {
    return { status: 'ok' };
  }

  @Post('db')
  checkDatabase() {
    return this.healthService.checkDatabase();
  }

  @Delete('db')
  resetDatabase() {
    return this.healthService.resetDatabase();
  }
}
