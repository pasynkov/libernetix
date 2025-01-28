import {
  DynamicModule,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import {
  TerminusModule,
} from '@nestjs/terminus';
import {
  HealthService,
} from './health.service';
import {
  HealthController,
} from './health.controller';

export class HealthModule implements OnModuleInit {
  static forMonitoringApp(healthService: HealthService): DynamicModule {
    return {
      imports: [
        TerminusModule,
      ],
      controllers: [
        HealthController,
      ],
      providers: [
        {
          provide: HealthService,
          useValue: healthService,
        },
      ],
      module: HealthModule,
    };
  }

  static forRoot(): DynamicModule {
    return {
      global: true,
      module: HealthModule,
      imports: [
        TerminusModule,
      ],
      providers: [
        HealthService,
      ],
      exports: [
        HealthService,
      ],
    };
  }

  public onModuleInit() {

  }
}
