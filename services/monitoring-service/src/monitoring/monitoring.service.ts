import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsTotal: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>,
    @InjectMetric('active_services')
    private readonly activeServices: Gauge<string>,
  ) {}

  getMetrics() {
    return {
      httpRequestsTotal: this.httpRequestsTotal.get(),
      httpRequestDuration: this.httpRequestDuration.get(),
      activeServices: this.activeServices.get(),
    };
  }

  getServices() {
    return {
      services: [
        {
          name: 'api-gateway',
          status: 'up',
          lastCheck: new Date().toISOString(),
        },
        {
          name: 'document-service',
          status: 'up',
          lastCheck: new Date().toISOString(),
        },
        {
          name: 'task-service',
          status: 'up',
          lastCheck: new Date().toISOString(),
        },
      ],
    };
  }
} 