import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { WebhookController } from './webhook.controller';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { jest, expect, describe, it } from '@jest/globals';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have WebhookController', () => {
    const controller = module.get<WebhookController>(WebhookController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(WebhookController);
  });

  it('should have HealthController', () => {
    const controller = module.get<HealthController>(HealthController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(HealthController);
  });

  it('should have MetricsController', () => {
    const controller = module.get<MetricsController>(MetricsController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(MetricsController);
  });

  it('should have MetricsService', () => {
    const service = module.get<MetricsService>(MetricsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(MetricsService);
  });
}); 