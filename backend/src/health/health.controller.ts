import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
    // TODO: Add more health checks
    // (e.g., database, external services) and return their status as well.
  }
}
