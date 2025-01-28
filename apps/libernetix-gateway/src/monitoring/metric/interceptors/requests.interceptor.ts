import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import {
  InjectMetric,
} from '@willsoto/nestjs-prometheus';
import {
  Counter,
  Histogram,
} from 'prom-client';
import {
  Observable,
  tap,
} from 'rxjs';
import {
  HttpArgumentsHost,
} from '@nestjs/common/interfaces';

@Injectable()
export class RequestsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('requests_count') private requestsCount: Counter,
    @InjectMetric('requests_time') private requestsTime: Histogram,
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    switch (context.getType()) {
      case 'http':
        return this.interceptHttp(context.switchToHttp(), next);
      default:
        next.handle();
    }
  }

  interceptHttp(httpArgumentsHost: HttpArgumentsHost, next: CallHandler): Observable<unknown> {
    this.requestsCount.labels({
      method: httpArgumentsHost.getRequest().method,
    }).inc();
    const done = this.requestsTime.labels({
      method: httpArgumentsHost.getRequest().method,
      path: httpArgumentsHost.getRequest().routeOptions.config.url,
    }).startTimer();

    return next
      .handle()
      .pipe(
        tap(() => {
          done({
            status: httpArgumentsHost.getResponse().statusCode,
          });
        }),
      );
  }
}
