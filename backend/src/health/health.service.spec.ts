import { PrismaService } from '../prisma/prisma.service.js';
import { HealthService } from './health.service.js';

describe('HealthService', () => {
  it('returns database status when Prisma can query users', async () => {
    const count = vi.fn().mockResolvedValue(0);
    const prisma = {
      user: { count },
    } as unknown as PrismaService;
    const service = new HealthService(prisma);

    await expect(service.check()).resolves.toEqual({ db: 'ok' });

    expect(count).toHaveBeenCalledOnce();
  });

  it('propagates database errors', async () => {
    const prisma = {
      user: {
        count: vi.fn().mockRejectedValue(new Error('database unavailable')),
      },
    } as unknown as PrismaService;
    const service = new HealthService(prisma);

    await expect(service.check()).rejects.toThrow('database unavailable');
  });
});
