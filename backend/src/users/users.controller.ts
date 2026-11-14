import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import {
  AllowAnonymous,
  OptionalAuth,
  Session,
} from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getCurrentUser(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Get('public')
  @AllowAnonymous()
  getPublic() {
    return { message: 'Public route' };
  }

  @Get('optional')
  @OptionalAuth()
  getOptional(@Session() session: UserSession) {
    return { authenticated: !!session };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ---------------------------

  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch(':id/profile')
  updateProfile(
    @Param('id') id: string,
    @Body() data: UpdateProfileDto,
    @Session() session: UserSession,
  ) {
    this.assertOwnUser(id, session);
    return this.usersService.updateProfile(id, data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @Session() session: UserSession,
  ) {
    this.assertOwnUser(id, session);
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    this.assertOwnUser(id, session);
    return this.usersService.remove(id);
  }

  private assertOwnUser(id: string, session: UserSession) {
    if (session.user.id !== id) {
      throw new ForbiddenException('You can only modify your own user account');
    }
  }
}
