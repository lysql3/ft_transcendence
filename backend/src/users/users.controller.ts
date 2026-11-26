import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Session() session: UserSession) {
    return this.usersService.getMe(session.user.id);
  }

  @Patch('me')
  updateMe(@Session() session: UserSession, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(session.user.id, dto);
  }

  @Get('me/profile')
  getMyProfile(@Session() session: UserSession) {
    return this.usersService.getMyProfile(session.user.id);
  }

  @Patch('me/profile')
  updateMyProfile(@Session() session: UserSession, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMyProfile(session.user.id, dto);
  }

  @Get('me/matches')
  getMyMatches(@Session() session: UserSession) {
    return this.usersService.getMatchesOf(session.user.id);
  }

  @AllowAnonymous()
  @Get('leaderboard')
  leaderboard(@Query() query: PaginationQueryDto) {
    return this.usersService.leaderboard(query);
  }

  @AllowAnonymous()
  @Get(':username')
  getPublic(@Param('username') username: string) {
    return this.usersService.getPublicByUsername(username);
  }

  @AllowAnonymous()
  @Get(':username/matches')
  getMatches(@Param('username') username: string) {
    return this.usersService.getMatchesByUsername(username);
  }
}
