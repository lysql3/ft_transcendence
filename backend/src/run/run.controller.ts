import { Body, Controller, Post } from '@nestjs/common';
import { RunService } from './run.service.js';
import { RunCodeDto } from './dto/run-code.dto.js';
import { Throttle } from '@nestjs/throttler';

@Controller('run')
export class RunController {
  constructor(private readonly runService: RunService) {}

  @Throttle({ default: { ttl: 60_000, limit: 10 } }) // NOTE : to limit spam
  @Post()
  run(@Body() dto: RunCodeDto) {
    return this.runService.run(dto);
  }
}
