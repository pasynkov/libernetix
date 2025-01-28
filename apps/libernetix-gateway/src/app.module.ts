import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LibernetixConnectorModule } from './modules/libernetix-connector/libernetix-connector.module';
import { LibernetixConnectorService } from './modules/libernetix-connector/libernetix-connector.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LibernetixConnectorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
