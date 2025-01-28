import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LibernetixS2sConnectorService } from './libernetix-s2s-connector.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          headers: {
            Authorization: `Bearer ${configService.get('LIBERNETIX_S2S_TOKEN')}`,
          },
          params: {
            s2s: true,
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    LibernetixS2sConnectorService,
  ],
  exports: [
    LibernetixS2sConnectorService,
  ],
})
export class LibernetixS2sConnectorModule {

}
