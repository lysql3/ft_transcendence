import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';


@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger (HealthService.name);

  async check() {
    await this.prisma.user.count();
    this.logger.log('Health check passed: Database connection is healthy.');
    return { db: 'ok' };
  }
}
