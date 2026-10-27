import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash: dto.password, // Hash this later with bcrypt!
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }
  
  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      throw new NotFoundException(`User with ID ${userId} not found`);

    let profile = await this.prisma.userProfile.findUnique({ where: { userId }, });
    if (!profile)
      profile = await this.prisma.userProfile.create({ data: { userId }, });
    return profile;
  }

  async updateProfile(userId: number, data: UpdateProfileDto) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data},
    });
  }

}
