import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(
    @Inject('MONITORING_SERVICE') private readonly monitoringClient: ClientProxy,
    @InjectMetric('http_requests_total') private readonly httpRequestsCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds') private readonly httpRequestDuration: Histogram<string>,
  ) {}

  async trackRequest(method: string, path: string, statusCode: number, duration: number) {
    // Track in Prometheus
    this.httpRequestsCounter.inc({
      method,
      path,
      status: statusCode.toString(),
    });

    this.httpRequestDuration.observe(
      {
        method,
        path,
        status: statusCode.toString(),
      },
      duration,
    );

    // Send to monitoring service via RabbitMQ
    this.monitoringClient.emit('request_metrics', {
      timestamp: new Date().toISOString(),
      method,
      path,
      statusCode,
      duration,
    });

    // Log to Elasticsearch via logger
    this.logger.log({
      message: 'Request processed',
      method,
      path,
      statusCode,
      duration,
    });
  }

  async trackError(error: Error, context: string) {
    // Track in Prometheus
    this.httpRequestsCounter.inc({
      method: 'error',
      path: context,
      status: '500',
    });

    // Send to monitoring service
    this.monitoringClient.emit('error_metrics', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      context,
    });

    // Log to Elasticsearch
    this.logger.error({
      message: 'Error occurred',
      error: error.message,
      stack: error.stack,
      context,
    });
  }

  async trackTaskOperation(operation: string, taskId: string, duration: number) {
    // Track in Prometheus
    this.httpRequestsCounter.inc({
      method: 'task',
      path: `tasks/${operation}`,
      status: '200',
    });

    // Send to monitoring service
    this.monitoringClient.emit('task_metrics', {
      timestamp: new Date().toISOString(),
      operation,
      taskId,
      duration,
    });

    // Log to Elasticsearch
    this.logger.log({
      message: 'Task operation completed',
      operation,
      taskId,
      duration,
    });
  }

  async trackWebhookEvent(eventType: string, payload: any, duration: number) {
    // Track in Prometheus
    this.httpRequestsCounter.inc({
      method: 'webhook',
      path: `webhooks/${eventType}`,
      status: '200',
    });

    // Send to monitoring service
    this.monitoringClient.emit('webhook_metrics', {
      timestamp: new Date().toISOString(),
      eventType,
      payload,
      duration,
    });

    // Log to Elasticsearch
    this.logger.log({
      message: 'Webhook event processed',
      eventType,
      payload,
      duration,
    });
  }

  async trackHealthCheck(service: string, status: string, duration: number) {
    // Track in Prometheus
    this.httpRequestsCounter.inc({
      method: 'health',
      path: `health/${service}`,
      status,
    });

    // Send to monitoring service
    this.monitoringClient.emit('health_metrics', {
      timestamp: new Date().toISOString(),
      service,
      status,
      duration,
    });

    // Log to Elasticsearch
    this.logger.log({
      message: 'Health check completed',
      service,
      status,
      duration,
    });
  }
} 