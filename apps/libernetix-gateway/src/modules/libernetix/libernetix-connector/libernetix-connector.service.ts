import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, pipe } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PurchaseInput } from './interfaces/purchase-input.interface';
import { components } from '../openapi';

type DeepPartial<T> = { // todo OpenAPI's optional fields generated as required. find out how to fix it
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

@Injectable()
export class LibernetixConnectorService {

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
  }

  async createPurchase(input: PurchaseInput, brandId = this.configService.get('LIBERNETIX_BRAND_ID')): Promise<components['schemas']['Purchase']> {

    if (!brandId) {
      throw new Error('Brand ID is not defined');
    }

    return firstValueFrom(this.httpService.post<components['schemas']['Purchase'], DeepPartial<components['schemas']['Purchase']>>('purchases/', {
      client: {
        email: input.email,
      },
      purchase: {
        products: input.products,
        currency: input.currency,
      },
      brand_id: brandId,
      success_redirect: 'http://localhost/success',
      failure_redirect: 'http://localhost/failure',
    }).pipe(
      catchError((err) => {
        console.log(err.response);
        throw err;
      }),
      map((response) => response.data),
    ));
  }
}
