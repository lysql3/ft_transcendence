import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UsersController } from './users.controller.js';
import type { UsersService } from './users.service.js';

describe('UsersController', () => {
  const update = vi.fn();
  const deleteAccount = vi.fn();
  const service = {
    update,
    delete: deleteAccount,
  } as unknown as UsersService;
  const controller = new UsersController(service);
  const session = {
    user: { id: 'user-1', name: 'Test User' },
  } as UserSession;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the authenticated user', () => {
    expect(controller.getCurrentUser(session)).toEqual({ user: session.user });
  });

  it('updates the authenticated user', async () => {
    const updatedUser = { id: 'user-1', name: 'Updated name' };
    update.mockResolvedValue(updatedUser);

    await expect(
      controller.updateMe({ name: 'Updated name' }, session),
    ).resolves.toEqual(updatedUser);
    expect(update).toHaveBeenCalledWith('user-1', {
      name: 'Updated name',
    });
    expect(update).toHaveBeenCalledOnce();
  });

  it('deletes the authenticated user', async () => {
    deleteAccount.mockResolvedValue({ message: 'Account deleted' });

    await expect(controller.deleteMe(session)).resolves.toEqual({
      message: 'Account deleted',
    });
    expect(deleteAccount).toHaveBeenCalledWith('user-1');
  });
});
