import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyStats(userId: string) {
    const challengesSolved = await this.prisma.problem.count({
      where: {
        submissions: {
          some: {
            userId,
            status: 'accepted',
          },
        },
      },
    });

    return { challengesSolved };
  }
}
