import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, pipe } from 'rxjs';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class LibernetixConnectorService {

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
  }

  async createPurchase(input, brandId: string = this.configService.get('LIBERNETIX_BRAND_ID')) {
    data.brand_id = this.configService.get('LIBERNETIX_BRAND_ID');
    return firstValueFrom(this.httpService.post('purchases/', data).pipe(
      catchError((err) => {
        console.log(err.response);
        throw err;
      }),
      map((response) => response.data),
    ));
  }
}
