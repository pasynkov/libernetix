import { Injectable } from '@nestjs/common';
import { PurchaseRequestDto } from './dto/purchase.request.dto';
import {
  LibernetixConnectorService,
  LibernetixS2sConnectorService,
} from './modules/libernetix';


@Injectable()
export class AppService {

  constructor(
    private readonly libernetixConnectorService: LibernetixConnectorService,
    private readonly libernetixS2sConnectorService: LibernetixS2sConnectorService,
  ) {}

  async donationPayment(request: PurchaseRequestDto, meta?: any): Promise<any> {
    const purchase = await this.libernetixConnectorService.createPurchase({
      email: request.client.email,
      // todo screen,
      products: [
        {
          name: 'Donation',
          price: request.amount,
        },
      ],
      currency: request.currency,
    });

    const charge = await this.libernetixS2sConnectorService.charge(purchase.direct_post_url, {
      cardholder_name: request.card.cardholderName,
      card_number: request.card.cardNumber,
      expires: [request.card.expires.mm, request.card.expires.yy].join('/'),
      cvc: request.card.cvc,
      remember_card: request.card.remember ? 'on' : undefined,
      remote_ip: '8.8.8.8', // todo
      user_agent: '', // todo
      accept_header: 'application/json',
      language: 'ru-RU', // todo,
      java_enabled: false,
      javascript_enabled: true,
      color_depth: 24,
      utc_offset: 0, // todo
      screen_width: 1920, // todo
      screen_height: 1080, // todo
    });

    console.log('charge', charge);

  }

}
