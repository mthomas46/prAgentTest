import { MetricsService } from './metrics.service';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(() => {
    service = new MetricsService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with empty metrics', () => {
    const metrics = service.getMetrics();
    expect(metrics).toBe('# HELP http_requests_total Total number of HTTP requests\n# TYPE http_requests_total counter\n');
  });

  it('should increment request metrics', () => {
    service.incrementRequest('GET', '/health', 200);
    service.incrementRequest('POST', '/webhook', 200);
    service.incrementRequest('GET', '/health', 400);

    const metrics = service.getMetrics();
    expect(metrics).toContain('http_requests_total{method="GET",path="/health",status="200"} 1');
    expect(metrics).toContain('http_requests_total{method="POST",path="/webhook",status="200"} 1');
    expect(metrics).toContain('http_requests_total{method="GET",path="/health",status="400"} 1');
  });

  it('should handle multiple requests to same endpoint', () => {
    service.incrementRequest('GET', '/health', 200);
    service.incrementRequest('GET', '/health', 200);
    service.incrementRequest('GET', '/health', 200);

    const metrics = service.getMetrics();
    expect(metrics).toContain('http_requests_total{method="GET",path="/health",status="200"} 3');
  });
}); 