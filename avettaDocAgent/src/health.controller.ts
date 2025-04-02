import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('health')
export class HealthController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  check() {
    this.metricsService.incrementRequest('GET', '/health', 200);
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
} 