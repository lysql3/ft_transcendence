import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

export const DATABASE_POOL = Symbol('DATABASE_POOL');

@Injectable()
export class HealthService implements OnModuleDestroy {
  constructor(@Inject(DATABASE_POOL) private readonly database: Pool) {}

  async checkDatabase() {
    await this.database.query(`
      CREATE TABLE IF NOT EXISTS health_db_probe (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const result = await this.database.query(
      'INSERT INTO health_db_probe DEFAULT VALUES RETURNING id, created_at',
    );

    return {
      status: 'ok',
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at,
    };
  }

  async resetDatabase() {
    await this.database.query('DROP TABLE IF EXISTS health_db_probe');
    await this.database.query(`
      CREATE TABLE health_db_probe (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    return { status: 'ok', reset: true };
  }

  async onModuleDestroy() {
    await this.database.end();
  }
}
