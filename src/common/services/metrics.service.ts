import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total') private httpRequestsCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds') private httpRequestDuration: Histogram<string>,
  ) {}

  incrementHttpRequests(method: string, path: string, status: number) {
    this.httpRequestsCounter.inc({ method, path, status: status.toString() });
  }

  observeHttpRequestDuration(method: string, path: string, duration: number) {
    this.httpRequestDuration.observe({ method, path }, duration);
  }
} 