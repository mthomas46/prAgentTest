import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';

jest.mock('./metrics.service');

describe('MetricsController', () => {
  let controller: MetricsController;
  let metricsService: jest.Mocked<MetricsService>;

  beforeEach(() => {
    metricsService = new MetricsService() as jest.Mocked<MetricsService>;
    controller = new MetricsController(metricsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get metrics', () => {
    const mockMetrics = '# HELP http_requests_total Total number of HTTP requests\n# TYPE http_requests_total counter\nhttp_requests_total{method="GET",path="/health",status="200"} 1';
    metricsService.getMetrics.mockReturnValue(mockMetrics);

    const result = controller.getMetrics();
    expect(result).toBe(mockMetrics);
    expect(metricsService.getMetrics).toHaveBeenCalled();
  });
}); 