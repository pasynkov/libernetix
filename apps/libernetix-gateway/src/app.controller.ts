import { Body, Controller, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { PurchaseRequestDto } from './dto/purchase.request.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Post('purchase')
  async requestPurchase(@Body() request: PurchaseRequestDto): Promise<any> {
    return this.appService.donationPayment(request);
  }
}
