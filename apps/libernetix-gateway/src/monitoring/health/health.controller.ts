import {
  Controller,
  Get,
} from '@nestjs/common';
import {
  HealthCheck,
} from '@nestjs/terminus';
import {
  HealthCheckResult,
} from '@nestjs/terminus/dist/health-check/health-check-result.interface';
import {
  HealthService,
} from './health.service';

@Controller()
export class HealthController {
  constructor(private healthService: HealthService) {
  }

  @Get('healthy') // todo config?
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.healthService.check();
  }
}
