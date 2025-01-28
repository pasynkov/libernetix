import {
  Counter,
} from 'prom-client';
import {
  Injectable,
} from '@nestjs/common';

@Injectable()
export class PurchaseAmountStatusMetric extends Counter {
  constructor() {
    super({
      name: 'purchase_amount_status',
      help: 'Amount of completed or errored purchases',
      labelNames: [ 'status', 'currency' ],
    });
  }
}
