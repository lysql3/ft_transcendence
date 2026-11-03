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
      },
      omit: { passwordHash: true }
    });
  }

  findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' }, omit: { passwordHash: true }, });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id }, omit: {passwordHash: true}, });
  }

  update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data, omit: {passwordHash: true} });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id }, omit: {passwordHash: true} });
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
      create: {
        userId,
        displayName: data.displayName,
        avatar: data.avatar,
        bio: data.bio,
      },
    });
  }

}
