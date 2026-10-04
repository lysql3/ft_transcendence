import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return initial users list', () => {
    const users = service.findAll();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty('username');
    expect(users[0]).toHaveProperty('email');
  });

  it('should create a new user', () => {
    const initialCount = service.findAll().length;
    const user = service.create({ username: 'diana', email: 'diana@example.com' });
    expect(user.username).toBe('diana');
    expect(service.findAll().length).toBe(initialCount + 1);
  });

  it('should remove a user', () => {
    const user = service.create({ username: 'evan', email: 'evan@example.com' });
    const res = service.remove(user.id);
    expect(res.success).toBe(true);
  });
});
