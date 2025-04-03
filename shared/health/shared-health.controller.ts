import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { SharedHealthService } from './shared-health.service';

@Controller('health')
export class SharedHealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: SharedHealthService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.healthService.checkDatabase(),
      () => this.healthService.checkRabbitMQ(),
      () => this.healthService.checkElasticsearch(),
    ]);
  }
} 