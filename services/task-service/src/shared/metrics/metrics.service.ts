import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  private readonly httpRequestsTotal: Counter;
  private readonly httpRequestDurationSeconds: Counter;
  private readonly httpRequestSizeBytes: Counter;
  private readonly httpResponseSizeBytes: Counter;
  private readonly httpErrorsTotal: Counter;
  private readonly appMemoryUsageBytes: Gauge;

  constructor() {
    this.registry = new Registry();
    
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
      registers: [this.registry]
    });

    this.httpRequestDurationSeconds = new Counter({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path'],
      registers: [this.registry]
    });

    this.httpRequestSizeBytes = new Counter({
      name: 'http_request_size_bytes',
      help: 'HTTP request size in bytes',
      labelNames: ['method', 'path'],
      registers: [this.registry]
    });

    this.httpResponseSizeBytes = new Counter({
      name: 'http_response_size_bytes',
      help: 'HTTP response size in bytes',
      labelNames: ['method', 'path'],
      registers: [this.registry]
    });

    this.httpErrorsTotal = new Counter({
      name: 'http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['method', 'path', 'status'],
      registers: [this.registry]
    });

    this.appMemoryUsageBytes = new Gauge({
      name: 'app_memory_usage_bytes',
      help: 'Application memory usage in bytes',
      registers: [this.registry]
    });
  }

  incrementHttpRequestsTotal(labels: { method: string; path: string; status: number }): void {
    this.httpRequestsTotal.inc(labels);
  }

  observeHttpRequestDurationSeconds(labels: { method: string; path: string }, duration: number): void {
    this.httpRequestDurationSeconds.inc(labels, duration);
  }

  observeHttpRequestSizeBytes(labels: { method: string; path: string }, size: number): void {
    this.httpRequestSizeBytes.inc(labels, size);
  }

  observeHttpResponseSizeBytes(labels: { method: string; path: string }, size: number): void {
    this.httpResponseSizeBytes.inc(labels, size);
  }

  incrementHttpErrorsTotal(labels: { method: string; path: string; status: number }): void {
    this.httpErrorsTotal.inc(labels);
  }

  setAppMemoryUsageBytes(bytes: number): void {
    this.appMemoryUsageBytes.set(bytes);
  }

  async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }
} 