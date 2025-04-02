import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { MetricsService } from './metrics.service';
import { WebhookResponse } from './interfaces/webhook-event.interface';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly metricsService: MetricsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-webhook-signature') signature: string,
  ): Promise<WebhookResponse> {
    if (!signature) {
      this.metricsService.incrementRequest('POST', '/webhook', 400);
      return {
        success: false,
        message: 'Missing webhook signature',
        timestamp: new Date().toISOString(),
      };
    }

    const response = await this.webhookService.processWebhook(payload, signature);
    this.metricsService.incrementRequest('POST', '/webhook', response.success ? 200 : 400);
    return response;
  }
} 