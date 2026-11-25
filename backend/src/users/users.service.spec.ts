import { UsersService } from './users.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';

describe('UsersService', () => {
  it('updates only the editable user fields and returns the profile fields', async () => {
    const updatedUser = {
      id: 'user-1',
      username: 'test-user',
      name: 'Updated name',
      image: null,
      createdAt: new Date(),
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
