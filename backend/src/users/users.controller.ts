import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@Session() session: UserSession) {
    const user = await this.usersService.findById(session.user.id);
    return { user };
  }

  @Patch('me')
  updateMe(@Body() data: UpdateUserDto, @Session() session: UserSession) {
    return this.usersService.update(session.user.id, data);
  }

  @Delete('me')
  deleteMe(@Session() session: UserSession) {
    return this.usersService.delete(session.user.id);
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
