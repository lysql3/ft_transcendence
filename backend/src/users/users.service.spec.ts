import { UsersService } from './users.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';

describe('UsersService', () => {
  it('fetches a user with its profile relation', async () => {
    const user = { id: 'user-1', profile: { bio: 'Hello', elo: 1200 } };
    const findUnique = vi.fn().mockResolvedValue(user);
    const prisma = { user: { findUnique } } as unknown as PrismaService;
    const service = new UsersService(prisma);

    await expect(service.getMe('user-1')).resolves.toEqual(user);
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: {
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
        email: true,
        emailVerified: true,
      },
    });
  });

  it('updates the editable user fields', async () => {
    const updatedUser = { id: 'user-1', name: 'Updated name' };
    const update = vi.fn().mockResolvedValue(updatedUser);
    const prisma = { user: { update } } as unknown as PrismaService;
    const service = new UsersService(prisma);

    await expect(
      service.updateMe('user-1', { name: 'Updated name' }),
    ).resolves.toEqual(updatedUser);

    expect(update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { name: 'Updated name' },
      select: { id: true, name: true, username: true, image: true },
    });
  });

  it('updates the authenticated user profile', async () => {
    const profile = { userId: 'user-1', bio: 'Updated bio' };
    const upsert = vi.fn().mockResolvedValue(profile);
    const prisma = {
      userProfile: { upsert },
    } as unknown as PrismaService;
    const service = new UsersService(prisma);

    await expect(service.updateMyProfile('user-1', { bio: 'Updated bio' })).resolves.toEqual(
      profile,
    );
    expect(upsert).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      update: { bio: 'Updated bio' },
      create: { userId: 'user-1', bio: 'Updated bio' },
    });
  });
});
