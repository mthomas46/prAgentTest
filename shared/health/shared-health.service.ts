import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { RABBITMQ_QUEUE } from '../constants/app.constants';

@Injectable()
export class SharedHealthService extends HealthIndicator {
  constructor(
    private configService: ConfigService,
    @Inject('RABBITMQ_CLIENT') private rabbitmqClient: ClientProxy,
  ) {
    super();
  }

  async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      // Add database health check logic here
      return this.getStatus('database', true);
    } catch (error) {
      return this.getStatus('database', false, { error: error.message });
    }
  }

  async checkRabbitMQ(): Promise<HealthIndicatorResult> {
    try {
      await this.rabbitmqClient.emit(RABBITMQ_QUEUE.HEALTH_CHECK, {}).toPromise();
      return this.getStatus('rabbitmq', true);
    } catch (error) {
      return this.getStatus('rabbitmq', false, { error: error.message });
    }
  }

  async checkElasticsearch(): Promise<HealthIndicatorResult> {
    try {
      // Add Elasticsearch health check logic here
      return this.getStatus('elasticsearch', true);
    } catch (error) {
      return this.getStatus('elasticsearch', false, { error: error.message });
    }
  }
} 