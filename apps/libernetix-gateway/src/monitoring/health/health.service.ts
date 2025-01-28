import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import {
  HealthCheckService, HttpHealthIndicator,
} from '@nestjs/terminus';
import {
  HealthCheckResult,
} from '@nestjs/terminus/dist/health-check/health-check-result.interface';
import { ConfigService } from '@nestjs/config';

@Injectable({
})
export class HealthService {
  private logger = new Logger(HealthService.name);


  constructor(
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
  ) {
  }

  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.http.responseCheck('Public API', 'http://localhost:' + this.configService.get('PORT'), (res) => res.status === 404),
      () => this.http.responseCheck('Libernetix API', 'https://gate.libernetix.com/api/v1/', (res) => res.status === 404),
    ]);
  }
}
