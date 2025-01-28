import {
  Controller,
} from '@nestjs/common';
import {
  PrometheusController,
} from '@willsoto/nestjs-prometheus';

@Controller('metrics')
export class MetricController extends PrometheusController {
}
