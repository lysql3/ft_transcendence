import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import * as bcrypt from 'bcrypt'

// TODO: Authentication

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto)
  {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    try {
      return await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          passwordHash,
          profile: { create: {} },
        },
        omit: { passwordHash: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002')
            throw new ConflictException('Username or email already exists');
      throw error;
    }
  }

  findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' }, omit: { passwordHash: true }, });
  }
  
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where : { id },
      omit  : { passwordHash: true },
    });
    
    if (!user)
      throw new NotFoundException('User not found');

    return user;
  }

  async updatePassword(id: number, dto: UpdatePasswordDto) {
	  const user = await this.prisma.user.findUnique({
		  where: { id },
	  });

	  if (!user) {
		  throw new NotFoundException('User not found');
	  }

	  const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.passwordHash);
	  if (!isPasswordValid) {
		  throw new UnauthorizedException('Incorrect old password');
	  }

	  const newPasswordHash = await bcrypt.hash(dto.newPassword, 12);

	  await this.prisma.user.update({
		  where: { id },
		  data: { passwordHash: newPasswordHash },
	  });

	  return { message: 'Password updated succefuly' };
  }

  async update(id: number, data: UpdateUserDto) {
    await this.findOne(id);

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        omit: { passwordHash: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Username or email already exists');
      }

      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    const results = await this.prisma.$transaction([
      this.prisma.userProfile.delete({
        where: { userId: id },
      }),
      this.prisma.user.delete({
        where: { id },
        omit: { passwordHash: true },
      }),
    ]);

    return results[1];
    // TODO: Return 409 Conflict when matches or submissions block user deletion.
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

  async	getLeaderBoard() {
	  return this.prisma.user.findMany({
		  orderBy: { rating: 'desc'},
		  take: 50,
		  omit: { passwordHash: true},
		  include: { profile: true},
	  });
  }

}
