import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
  LibernetixConnectorModule,
  LibernetixS2sConnectorModule
} from './modules/libernetix';
import { HealthModule } from './monitoring/health';
import { MetricModule } from './monitoring/metric';
import { ThrottlerModule } from '@nestjs/throttler';
import { RequestPurchaseAmountMetric } from './metrics/request-purchase-amount.metric';
import { PurchaseAmountStatusMetric } from './metrics/purchase-amount-status.metric';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LibernetixConnectorModule,
    LibernetixS2sConnectorModule,
    HealthModule.forRoot(),
    MetricModule.forRoot({
      metrics: [
        RequestPurchaseAmountMetric,
        PurchaseAmountStatusMetric,
      ],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
