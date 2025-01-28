import {
  Counter,
} from 'prom-client';
import {
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RequestPurchaseAmountMetric extends Counter {
  constructor() {
    super({
      name: 'request_purchase_amount',
      help: 'Amount of requested purchases',
      labelNames: [ 'currency' ],
    });
  }
}
