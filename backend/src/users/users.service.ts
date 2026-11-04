import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);

    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash,
        profile: { create: {} },
      },
      omit: { passwordHash: true },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' }, omit: { passwordHash: true }, });
  }
  
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where : { id },
      omit  : { passwordHash: true },
    });
    
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data,
      omit: { passwordHash: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
      omit: { passwordHash: true },
    });
  }

  async getProfile(userId: number) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!profile)
      throw new NotFoundException(`User with ID ${userId} does not exist`);    
    return profile;
  }

  async updateProfile(userId: number, data: UpdateProfileDto) {
    await this.getProfile(userId);

    return this.prisma.userProfile.update({
      where: { userId },
      data,
    });
  }

}
