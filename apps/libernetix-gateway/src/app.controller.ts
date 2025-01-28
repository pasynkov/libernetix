import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PurchaseRequestDto } from './dto/purchase.request.dto';
import { RequestPurchaseAmountMetric } from './metrics/request-purchase-amount.metric';
import { PurchaseAmountStatusMetric } from './metrics/purchase-amount-status.metric';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private requestPurchaseAmountMetric: RequestPurchaseAmountMetric,
    private purchaseAmountStatusMetric: PurchaseAmountStatusMetric,
  ) {}

  @Post('purchase')
  async requestPurchase(
    @Body() request: PurchaseRequestDto,
    @Ip() ipAddress: string,
    @Headers('x-forwarded-for') xForwardedFor: string,
    @Headers('user-agent') userAgent: string,
    @Headers('referer') referer: string,
  ): Promise<any> {

    this.requestPurchaseAmountMetric.labels({
      currency: request.currency,
    }).inc(request.amount);

    const ip = (xForwardedFor ?? ipAddress).split(',').shift();

    let successRedirect: string;
    let failureRedirect: string;

    try {
      successRedirect = new URL(request.client.success_route, referer).toString();
      failureRedirect = new URL(request.client.failed_route, referer).toString();
    } catch (e) {
      throw new BadRequestException('Referer is not provided');
    }

    const status = await this.appService.donationPayment(request, {
      ip,
      userAgent,
      screenWidth: request.client.screenWidth,
      screenHeight: request.client.screenHeight,
      language: request.client.language,
      utcOffset: request.client.utcOffset,
      successRedirect,
      failureRedirect,
    });

    this.purchaseAmountStatusMetric.labels({
      status: status.status,
      currency: request.currency,
    }).inc(request.amount);

    return status;

  }
}
