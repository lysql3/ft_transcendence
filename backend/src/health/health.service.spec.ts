import { Pool } from 'pg';
import { HealthService } from './health.service.js';

describe('HealthService', () => {
  it('creates the probe table and inserts a value', async () => {
    const database = {
      query: vi
        .fn()
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ id: 3, created_at: 'now' }] }),
      end: vi.fn(),
    } as unknown as Pool;
    const service = new HealthService(database);

    await expect(service.checkDatabase()).resolves.toEqual({
      status: 'ok',
      id: 3,
      createdAt: 'now',
    });

    expect(database.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('CREATE TABLE IF NOT EXISTS health_db_probe'),
    );
    expect(database.query).toHaveBeenNthCalledWith(
      2,
      'INSERT INTO health_db_probe DEFAULT VALUES RETURNING id, created_at',
    );
  });

  it('drops and recreates the probe table when reset', async () => {
    const database = {
      query: vi.fn().mockResolvedValue({ rows: [] }),
      end: vi.fn(),
    } as unknown as Pool;
    const service = new HealthService(database);

    await expect(service.resetDatabase()).resolves.toEqual({
      status: 'ok',
      reset: true,
    });

    expect(database.query).toHaveBeenNthCalledWith(
      1,
      'DROP TABLE IF EXISTS health_db_probe',
    );
    expect(database.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('CREATE TABLE health_db_probe'),
    );
  });
});
