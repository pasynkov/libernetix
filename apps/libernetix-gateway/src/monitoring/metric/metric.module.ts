import {
  Controller,
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  Optional,
  Provider,
  RequestMethod,
} from '@nestjs/common';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import {
  MetricController,
} from './metric.controller';
import {
  MetricsModuleOptions,
} from './metrics-module-options.interface';

@Controller()
class NoopMetricsController {}

@Module({
})
export class MetricModule {
  static forMetricApp(): DynamicModule {
    return {
      controllers: [
        MetricController,
      ],
      module: MetricModule,
    };
  }

  static forRoot(options?: MetricsModuleOptions): DynamicModule {
    const providers: Provider[] = [];

    if (options?.metrics?.length) {
      providers.push(...options.metrics);
    }

    return {
      global: true,
      module: MetricModule,
      imports: [
        PrometheusModule.register({
          defaultMetrics: {
            enabled: false,
          },
          controller: NoopMetricsController,
        }),
      ],
      providers,
      exports: providers,
    };
  }
}
