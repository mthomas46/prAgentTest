import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly requestsCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly requestDuration: Histogram<string>,
    @InjectMetric('http_request_size_bytes')
    private readonly requestSize: Histogram<string>,
    @InjectMetric('http_response_size_bytes')
    private readonly responseSize: Histogram<string>,
    @InjectMetric('http_errors_total')
    private readonly errorsCounter: Counter<string>,
    @InjectMetric('app_memory_usage_bytes')
    private readonly memoryGauge: Gauge<string>,
  ) {}

  recordRequest(method: string, path: string, statusCode: number, duration: number): void {
    const labels = { method, path, status: statusCode.toString() };
    this.requestsCounter.inc(labels);
    this.requestDuration.observe(labels, duration);
  }

  recordError(method: string, path: string, errorType: string): void {
    this.errorsCounter.inc({ method, path, error_type: errorType });
  }

  recordRequestSize(method: string, path: string, size: number): void {
    this.requestSize.observe({ method, path }, size);
  }

  recordResponseSize(method: string, path: string, size: number): void {
    this.responseSize.observe({ method, path }, size);
  }

  updateMemoryUsage(): void {
    const used = process.memoryUsage();
    this.memoryGauge.set({ type: 'heap' }, used.heapUsed);
    this.memoryGauge.set({ type: 'rss' }, used.rss);
  }
} 