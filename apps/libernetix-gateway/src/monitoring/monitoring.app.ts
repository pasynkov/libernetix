import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { HealthModule, HealthService } from './health';
import { MetricModule } from './metric';
import { DynamicModule, Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';


@Module({
})
class MonitoringApp {

}

export async function bootstrapMonitoringApp(donor: NestFastifyApplication): Promise<void> {

  const metricsAppModule: DynamicModule = {
    imports: [
      MetricModule.forMetricApp(),
      HealthModule.forMonitoringApp(donor.get(HealthService)),
    ],
    module: MonitoringApp,
  };

  const app = await NestFactory.create(
    metricsAppModule,
    new FastifyAdapter(),
  );
  await app.init();
  const configService = donor.get(ConfigService);
  await app.listen(configService.get('MONITOR_PORT') ? parseInt(configService.get('MONITOR_PORT'), 10) : 3002, '0.0.0.0');
}
