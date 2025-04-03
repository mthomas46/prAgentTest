import { HealthController } from './health.controller';
import { MetricsService } from './metrics.service';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';

jest.mock('./metrics.service');

describe('HealthController', () => {
  let controller: HealthController;
  let metricsService: jest.Mocked<MetricsService>;

  beforeEach(() => {
    metricsService = new MetricsService() as jest.Mocked<MetricsService>;
    controller = new HealthController(metricsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status', () => {
    const result = controller.check();
    expect(result).toEqual({
      status: 'ok',
      timestamp: expect.any(String)
    });
    expect(metricsService.incrementRequest).toHaveBeenCalledWith('GET', '/health', 200);
  });
}); 