import { ForbiddenException } from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UsersController } from './users.controller.js';
import type { UsersService } from './users.service.js';

describe('UsersController authorization', () => {
  const service = {
    update: vi.fn().mockResolvedValue({ id: 'user-1' }),
    updateProfile: vi.fn().mockResolvedValue({ userId: 'user-1' }),
    remove: vi.fn().mockResolvedValue({ id: 'user-1' }),
  } as unknown as UsersService;
  const controller = new UsersController(service);
  const session = {
    user: { id: 'user-1' },
  } as UserSession;

  it('allows a user to update their own account', async () => {
    await controller.update('user-1', { name: 'Updated name' }, session);

    expect(service.update).toHaveBeenCalledWith('user-1', {
      name: 'Updated name',
    });
  });

  it('rejects updating another user account', () => {
    expect(() =>
      controller.update('user-2', { name: 'Nope' }, session),
    ).toThrow(ForbiddenException);
    expect(service.update).not.toHaveBeenCalledWith('user-2', {
      name: 'Nope',
    });
  });

  it('rejects deleting another user account', () => {
    expect(() => controller.remove('user-2', session)).toThrow(
      ForbiddenException,
    );
    expect(service.remove).not.toHaveBeenCalledWith('user-2');
  });
});
