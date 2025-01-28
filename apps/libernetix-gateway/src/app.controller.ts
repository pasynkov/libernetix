import { BadRequestException, Body, Controller, Headers, Ip, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { PurchaseRequestDto } from './dto/purchase.request.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Post('purchase')
  async requestPurchase(
    @Body() request: PurchaseRequestDto,
    @Ip() ipAddress: string,
    @Headers('x-forwarded-for') xForwardedFor: string,
    @Headers('user-agent') userAgent: string,
    @Headers('referer') referer: string,
    @Headers() headers: any,
  ): Promise<any> {
    const ip = (xForwardedFor ?? ipAddress).split(',').shift();

    let successRedirect: string;
    let failureRedirect: string;

    try {
      successRedirect = new URL(request.client.success_route, referer).toString();
      failureRedirect = new URL(request.client.failed_route, referer).toString();
    } catch (e) {
      throw new BadRequestException('Referer is not provided');
    }

    return this.appService.donationPayment(request, {
      ip,
      userAgent,
      screenWidth: request.client.screenWidth,
      screenHeight: request.client.screenHeight,
      language: request.client.language,
      utcOffset: request.client.utcOffset,
      successRedirect,
      failureRedirect,
    });
  }
}
