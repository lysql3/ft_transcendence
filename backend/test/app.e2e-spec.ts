import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const prisma = {
      user: { count: vi.fn().mockResolvedValue(0) },
    };
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
    app.setGlobalPrefix('api');
    await app.init();
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
      .expect({ db: 'ok' });
  });

  it('/api/whoami (GET) uses forwarded request details', () => {
    return request(app.getHttpServer())
      .get('/api/whoami')
      .set('X-Forwarded-For', '203.0.113.10')
      .set('X-Forwarded-Proto', 'https')
      .expect(200)
      .expect({ ip: '203.0.113.10', protocol: 'https', secure: true });
  });

  afterAll(async () => {
    await app.close();
  });
});
