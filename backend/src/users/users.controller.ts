import { Controller, ForbiddenException, Get } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@Session() session: UserSession) {
    return { user: session.user };
  }

  private assertOwnUser(id: string, session: UserSession) {
    if (session.user.id !== id) {
      throw new ForbiddenException('You can only modify your own user account');
    }
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
