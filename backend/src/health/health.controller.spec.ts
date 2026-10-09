import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

describe('HealthController', () => {
  let controller: HealthController;
  const healthService = {
    checkDatabase: vi.fn(),
    resetDatabase: vi.fn(),
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

  it('delegates the database check to the health service', async () => {
    healthService.checkDatabase.mockResolvedValue({ status: 'ok', id: 1 });

    await expect(controller.checkDatabase()).resolves.toEqual({
      status: 'ok',
      id: 1,
    });
    expect(healthService.checkDatabase).toHaveBeenCalledOnce();
  });

  it('delegates the database reset to the health service', async () => {
    healthService.resetDatabase.mockResolvedValue({
      status: 'ok',
      reset: true,
    });

    await expect(controller.resetDatabase()).resolves.toEqual({
      status: 'ok',
      reset: true,
    });
    expect(healthService.resetDatabase).toHaveBeenCalledOnce();
  });
});
