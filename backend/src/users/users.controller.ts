import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Patch('me')
  updateMe(@Body() data: UpdateUserDto, @Session() session: UserSession) {
    return this.usersService.update(session.user.id, data);
  }
}

// @Get('public')
// @AllowAnonymous()
// getPublic() {
//   return { message: 'Public route' };
// }

// @Get('optional')
// @OptionalAuth()
// getOptional(@Session() session: UserSession) {
//   return { authenticated: !!session };
// }
