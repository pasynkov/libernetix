import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LibernetixConnectorService } from './libernetix-connector.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: configService.get('LIBERNETIX_API_URL'),
          headers: {
            Authorization: `Bearer ${configService.get('LIBERNETIX_API_KEY')}`,
          }
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    LibernetixConnectorService,
  ],
  exports: [
    LibernetixConnectorService,
  ],
})
export class LibernetixConnectorModule {

}
