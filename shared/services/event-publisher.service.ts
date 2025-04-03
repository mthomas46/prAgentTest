import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IEvent, ITaskEventData, EventType } from '../interfaces/events.interface';
import { ConfigService } from '@nestjs/config';
import { RetryService } from './retry.service';
import { DEFAULT_RETRY_CONFIG } from '../interfaces/retry.interface';

@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);
  private client: ClientProxy;

  constructor(
    private readonly configService: ConfigService,
    private readonly retryService: RetryService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
        queue: 'events_queue',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async publishEvent<T = ITaskEventData>(
    type: EventType,
    data: T,
    source: string,
    correlationId?: string,
  ): Promise<void> {
    const event: IEvent<T> = {
      type,
      data,
      timestamp: new Date(),
      source,
      correlationId,
    };

    await this.retryService.withRetry(
      async () => {
        await this.client.emit('events', event);
        this.logger.log(`Event published successfully: ${type}`);
      },
      {
        ...DEFAULT_RETRY_CONFIG,
        maxAttempts: 5, // More attempts for publishing
        initialDelay: 2000, // Longer initial delay
      },
    );
  }

  async publishTaskEvent(
    type: EventType,
    taskId: string,
    currentState: any,
    previousState?: any,
    userId?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    const eventData: ITaskEventData = {
      taskId,
      previousState,
      currentState,
      userId,
      metadata,
    };

    await this.publishEvent(type, eventData, 'task-service');
  }
} 