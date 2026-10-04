import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('App & Users Endpoints (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('/api/users (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/api/users (POST) and /api/users/:id (DELETE)', async () => {
    const createRes = await request(app.getHttpServer())
      .get('/api/users')
      .expect(200);
    const initialCount = createRes.body.length;

    const postRes = await request(app.getHttpServer())
      .post('/api/users')
      .send({ username: 'e2e_tester', email: 'e2e@example.com' })
      .expect(201);

    expect(postRes.body.username).toBe('e2e_tester');
    expect(postRes.body.id).toBeDefined();

    const checkRes = await request(app.getHttpServer())
      .get('/api/users')
      .expect(200);
    expect(checkRes.body.length).toBe(initialCount + 1);

    await request(app.getHttpServer())
      .delete(`/api/users/${postRes.body.id}`)
      .expect(200);
  });
});
