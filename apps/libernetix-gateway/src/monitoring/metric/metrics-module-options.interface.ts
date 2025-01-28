import {
  Counter,
  Gauge,
  Histogram,
  Summary,
} from 'prom-client';

export interface MetricsModuleOptions {
  metrics?: Array<typeof Counter | typeof Gauge | typeof Histogram | typeof Summary>;
}
