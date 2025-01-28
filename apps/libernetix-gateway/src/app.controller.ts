import { Body, Controller, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { LibernetixConnectorService } from './modules/libernetix-connector/libernetix-connector.service';
import { PurchaseRequestDto } from './dto/purchase.request.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly libernetixConnectorService: LibernetixConnectorService,
  ) {}

  @Post('purchase')
  async requestPurchase(@Body() request: PurchaseRequestDto): Promise<any> {

    console.log('re', request);

    // return this.libernetixConnectorService.createPurchase({
    //   "client": {
    //     "email": "test@test.com"
    //   },
    //   "purchase": {
    //     "products": [
    //       {
    //         "name": "test",
    //         "price": 100
    //       }
    //     ]
    //   },
    // });
  }
}
