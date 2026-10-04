import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      username: 'alice',
      email: 'alice@example.com',
      createdAt: new Date('2026-01-01T10:00:00Z'),
    },
    {
      id: '2',
      username: 'bob',
      email: 'bob@example.com',
      createdAt: new Date('2026-01-02T11:00:00Z'),
    },
    {
      id: '3',
      username: 'charlie',
      email: 'charlie@example.com',
      createdAt: new Date('2026-01-03T12:00:00Z'),
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    if (!createUserDto.username || !createUserDto.email) {
      throw new BadRequestException('Username and email are required');
    }

    const existing = this.users.find(
      (u) =>
        u.username.toLowerCase() === createUserDto.username.toLowerCase() ||
        u.email.toLowerCase() === createUserDto.email.toLowerCase(),
    );
    if (existing) {
      throw new BadRequestException('Username or email already exists');
    }

    const newUser: User = {
      id: String(Date.now()),
      username: createUserDto.username,
      email: createUserDto.email,
      createdAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    return user;
  }

  remove(id: string): { success: boolean; message: string } {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    this.users.splice(index, 1);
    return { success: true, message: `User ${id} deleted successfully` };
  }
}
