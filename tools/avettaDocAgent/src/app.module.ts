import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [],
  controllers: [HealthController, MetricsController, WebhookController],
  providers: [MetricsService],
})
export class AppModule {} 