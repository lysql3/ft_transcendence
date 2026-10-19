import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

describe('HealthController', () => {
  let controller: HealthController;
  const healthService = {
    check: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: healthService }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates the health check to the health service', async () => {
    healthService.check.mockResolvedValue({ db: 'ok' });

    await expect(controller.check()).resolves.toEqual({ db: 'ok' });
    expect(healthService.check).toHaveBeenCalledOnce();
  });
});
