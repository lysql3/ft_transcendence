import { UsersService } from './users.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';

describe('UsersService', () => {
  it('fetches a user with its profile relation', async () => {
    const user = {
      id: 'user-1',
      profile: { userId: 'user-1', bio: 'Hello', elo: 1200 },
    };
    const findUnique = vi.fn().mockResolvedValue(user);
    const prisma = { user: { findUnique } } as unknown as PrismaService;
    const service = new UsersService(prisma);

    await expect(service.findById('user-1')).resolves.toEqual(user);
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      include: { profile: true },
    });
  });

  it('updates only editable user fields and includes the profile', async () => {
    const updatedUser = {
      id: 'user-1',
      username: 'test-user',
      name: 'Updated name',
      image: null,
      createdAt: new Date(),
      profile: { userId: 'user-1', bio: 'Hello', elo: 1200 },
    };
    const update = vi.fn().mockResolvedValue(updatedUser);
    const prisma = { user: { update } } as unknown as PrismaService;
    const service = new UsersService(prisma);

    await expect(
      service.update('user-1', { name: 'Updated name' }),
    ).resolves.toEqual(updatedUser);

    expect(update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { name: 'Updated name' },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        createdAt: true,
        profile: true,
      },
    });
  });

  it('deletes the authenticated user', async () => {
    const deleteUser = vi.fn().mockResolvedValue({ id: 'user-1' });
    const prisma = {
      user: { delete: deleteUser },
    } as unknown as PrismaService;
    const service = new UsersService(prisma);

    await expect(service.delete('user-1')).resolves.toEqual({
      message: 'Account deleted',
    });
    expect(deleteUser).toHaveBeenCalledWith({ where: { id: 'user-1' } });
  });
});
