import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

const publicUserSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
  createdAt: true,
  profile: { select: { bio: true, elo: true } },
  _count: {
    select: {
      player1Matches: true,
      player2Matches: true,
      wonMatches: true,
      submissions: true,
    },
  },
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { ...publicUserSelect, email: true, emailVerified: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: dto,
        select: { id: true, name: true, username: true, image: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Username already taken');
      }
      throw e;
    }
  }

  getMyProfile(userId: string) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  updateMyProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }

  async getPublicByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: publicUserSelect,
    });
    if (!user) throw new NotFoundException(`User "${username}" not found`);
    return user;
  }

  async getMatchesOf(userId: string) {
    return this.prisma.match.findMany({
      where: { OR: [{ player1Id: userId }, { player2Id: userId }] },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        score1: true,
        score2: true,
        winnerId: true,
        createdAt: true,
        problem: { select: { title: true, slug: true } },
        player1: { select: { id: true, username: true } },
        player2: { select: { id: true, username: true } },
      },
    });
  }

  async getMatchesByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) throw new NotFoundException(`User "${username}" not found`);
    return this.getMatchesOf(user.id);
  }

  async leaderboard({ page = 1, limit = 20 }: PaginationQueryDto) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.userProfile.findMany({
        where: { user: { username: { not: null } } },
        orderBy: [{ elo: 'desc' }, { userId: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          elo: true,
          user: { select: { id: true, username: true, image: true } },
        },
      }),
      this.prisma.userProfile.count({
        where: { user: { username: { not: null } } },
      }),
    ]);

    return {
      items: items.map((p, i) => ({
        rank: (page - 1) * limit + i + 1,
        elo: p.elo,
        ...p.user,
      })),
      total,
      page,
      limit,
    };
  }
}
