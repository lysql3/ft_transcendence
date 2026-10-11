import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('whoami')
  getWhoAmI(@Req() request: Request) {
    return {
      ip: request.ip,
      protocol: request.protocol,
      secure: request.secure,
    };
  }
}
