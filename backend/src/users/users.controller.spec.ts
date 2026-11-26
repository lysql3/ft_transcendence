import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UsersController } from './users.controller.js';
import type { UsersService } from './users.service.js';

describe('UsersController', () => {
  const getMe = vi.fn();
  const updateMe = vi.fn();
  const getMyProfile = vi.fn();
  const service = {
    getMe,
    updateMe,
    getMyProfile,
  } as unknown as UsersService;
  const controller = new UsersController(service);
  const session = {
    user: { id: 'user-1', name: 'Test User' },
  } as UserSession;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the authenticated user with its profile', async () => {
    const user = { ...session.user, profile: { bio: 'Hello', elo: 1200 } };
    getMe.mockResolvedValue(user);

    await expect(controller.getMe(session)).resolves.toEqual(user);
    expect(getMe).toHaveBeenCalledWith('user-1');
  });

  it('updates the authenticated user', async () => {
    const updatedUser = { id: 'user-1', name: 'Updated name' };
    updateMe.mockResolvedValue(updatedUser);

    await expect(
      controller.updateMe(session, { name: 'Updated name' }),
    ).resolves.toEqual(updatedUser);
    expect(updateMe).toHaveBeenCalledWith('user-1', {
      name: 'Updated name',
    });
    expect(updateMe).toHaveBeenCalledOnce();
  });

  it('returns the authenticated user profile', async () => {
    const profile = { bio: 'Hello', elo: 1200 };
    getMyProfile.mockResolvedValue(profile);

    await expect(controller.getMyProfile(session)).resolves.toEqual(profile);
    expect(getMyProfile).toHaveBeenCalledWith('user-1');
  });
});
