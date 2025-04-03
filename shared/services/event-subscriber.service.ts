import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IEvent, EventType } from '../interfaces/events.interface';
import { ConfigService } from '@nestjs/config';
import { RetryService } from './retry.service';
import { DEFAULT_RETRY_CONFIG } from '../interfaces/retry.interface';

@Injectable()
export class EventSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(EventSubscriberService.name);
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

  async onModuleInit() {
    await this.subscribeToEvents();
  }

  private async subscribeToEvents() {
    try {
      await this.retryService.withRetry(
        async () => {
          await this.client.connect();
          this.logger.log('Connected to event queue');
        },
        {
          ...DEFAULT_RETRY_CONFIG,
          maxAttempts: 10, // More attempts for connection
          initialDelay: 5000, // Longer initial delay for connection
        },
      );

      this.client.subscribe('events', async (event: IEvent) => {
        await this.retryService.withRetry(
          async () => {
            this.logger.log(`Received event: ${event.type}`);
            await this.handleEvent(event);
          },
          {
            ...DEFAULT_RETRY_CONFIG,
            maxAttempts: 3, // Fewer attempts for event handling
          },
        );
      });
    } catch (error) {
      this.logger.error(`Failed to subscribe to events: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async handleEvent(event: IEvent) {
    switch (event.type) {
      case EventType.TASK_CREATED:
        await this.handleTaskCreated(event);
        break;
      case EventType.TASK_UPDATED:
        await this.handleTaskUpdated(event);
        break;
      case EventType.TASK_DELETED:
        await this.handleTaskDeleted(event);
        break;
      case EventType.TASK_STATUS_CHANGED:
        await this.handleTaskStatusChanged(event);
        break;
      case EventType.TASK_ASSIGNED:
        await this.handleTaskAssigned(event);
        break;
      case EventType.TASK_COMPLETED:
        await this.handleTaskCompleted(event);
        break;
      default:
        this.logger.warn(`Unknown event type: ${event.type}`);
    }
  }

  private async handleTaskCreated(event: IEvent) {
    this.logger.log(`Handling task created event: ${event.data.taskId}`);
    // Implement task created event handling logic
  }

  private async handleTaskUpdated(event: IEvent) {
    this.logger.log(`Handling task updated event: ${event.data.taskId}`);
    // Implement task updated event handling logic
  }

  private async handleTaskDeleted(event: IEvent) {
    this.logger.log(`Handling task deleted event: ${event.data.taskId}`);
    // Implement task deleted event handling logic
  }

  private async handleTaskStatusChanged(event: IEvent) {
    this.logger.log(`Handling task status changed event: ${event.data.taskId}`);
    // Implement task status changed event handling logic
  }

  private async handleTaskAssigned(event: IEvent) {
    this.logger.log(`Handling task assigned event: ${event.data.taskId}`);
    // Implement task assigned event handling logic
  }

  private async handleTaskCompleted(event: IEvent) {
    this.logger.log(`Handling task completed event: ${event.data.taskId}`);
    // Implement task completed event handling logic
  }
} 