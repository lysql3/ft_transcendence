import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: { name: data.name },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });
  }
}
