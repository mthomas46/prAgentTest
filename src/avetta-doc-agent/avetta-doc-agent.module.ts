import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { LoggerService } from '../common/services/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    HealthController,
    MetricsController,
    WebhookController,
    DocumentController,
  ],
  providers: [
    MetricsService,
    WebhookService,
    DocumentService,
    LoggerService,
  ],
  exports: [MetricsService],
})
export class AvettaDocAgentModule {} 