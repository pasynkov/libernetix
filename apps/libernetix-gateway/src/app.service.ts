import { ForbiddenException, Injectable } from '@nestjs/common';
import { PurchaseRequestDto } from './dto/purchase.request.dto';
import {
  LibernetixConnectorService,
  LibernetixS2sConnectorService,
} from './modules/libernetix';
import { DirectPost } from './modules/libernetix/libernetix-s2s-connector/interfaces/direct-post.interface';

export interface DonationMeta {
  ip: DirectPost['remote_ip'],
  userAgent: DirectPost['user_agent'],
  screenWidth: DirectPost['screen_width'],
  screenHeight: DirectPost['screen_height'],
  utcOffset: DirectPost['utc_offset'],
  language: DirectPost['language'],
  successRedirect: string,
  failureRedirect: string,
}

@Injectable()
export class AppService {

  constructor(
    private readonly libernetixConnectorService: LibernetixConnectorService,
    private readonly libernetixS2sConnectorService: LibernetixS2sConnectorService,
  ) {}

  async donationPayment(request: PurchaseRequestDto, meta: DonationMeta): Promise<any> {
    const purchase = await this.libernetixConnectorService.createPurchase({
      email: request.client.email,
      products: [
        {
          name: 'Donation',
          price: request.amount,
        },
      ],
      currency: request.currency,
      successRedirect: meta.successRedirect,
      failureRedirect: meta.failureRedirect,
    });

    console.log('pu', purchase);

    throw new ForbiddenException('some');

    // const charge = await this.libernetixS2sConnectorService.charge(purchase.direct_post_url, {
    //   cardholder_name: request.card.cardholderName,
    //   card_number: request.card.cardNumber,
    //   expires: [request.card.expires.mm, request.card.expires.yy].join('/'),
    //   cvc: request.card.cvc,
    //   remember_card: request.card.remember ? 'on' : undefined,
    //   remote_ip: meta.ip,
    //   user_agent: meta.userAgent,
    //   accept_header: 'application/json',
    //   language: meta.language,
    //   java_enabled: false,
    //   javascript_enabled: true,
    //   color_depth: 24,
    //   utc_offset: meta.utcOffset,
    //   screen_width: meta.screenWidth,
    //   screen_height: meta.screenHeight,
    // });

    // console.log('charge', charge);

  }

}
