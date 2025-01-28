import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
  LibernetixConnectorModule,
  LibernetixS2sConnectorModule
} from './modules/libernetix';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LibernetixConnectorModule,
    LibernetixS2sConnectorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
