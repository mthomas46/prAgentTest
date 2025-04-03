import { Injectable, Logger } from '@nestjs/common';
import { EventPublisherService } from './event-publisher.service';
import { IEvent } from '../interfaces/events.interface';

@Injectable()
export class EventBatchingService {
  private readonly logger = new Logger(EventBatchingService.name);
  private readonly batchSize: number;
  private readonly batchTimeout: number;
  private batch: IEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly eventPublisher: EventPublisherService,
  ) {
    this.batchSize = 50; // Default batch size
    this.batchTimeout = 5000; // Default timeout: 5 seconds
  }

  async addToBatch(event: IEvent): Promise<void> {
    this.batch.push(event);

    if (this.batch.length >= this.batchSize) {
      await this.processBatch();
    } else if (!this.batchTimer) {
      this.startBatchTimer();
    }
  }

  private startBatchTimer(): void {
    this.batchTimer = setTimeout(async () => {
      if (this.batch.length > 0) {
        await this.processBatch();
      }
      this.batchTimer = null;
    }, this.batchTimeout);
  }

  private async processBatch(): Promise<void> {
    if (this.batch.length === 0) {
      return;
    }

    try {
      const batchToProcess = [...this.batch];
      this.batch = [];

      // Group events by type for more efficient processing
      const eventsByType = this.groupEventsByType(batchToProcess);

      // Process each group of events
      for (const [type, events] of Object.entries(eventsByType)) {
        await this.processEventGroup(type, events);
      }

      this.logger.log(`Processed batch of ${batchToProcess.length} events`);
    } catch (error) {
      this.logger.error(`Failed to process batch: ${error.message}`, error.stack);
      // Retry failed events
      await this.handleFailedBatch();
    }
  }

  private groupEventsByType(events: IEvent[]): Record<string, IEvent[]> {
    return events.reduce((groups, event) => {
      const type = event.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(event);
      return groups;
    }, {} as Record<string, IEvent[]>);
  }

  private async processEventGroup(type: string, events: IEvent[]): Promise<void> {
    try {
      // Process events in smaller chunks if needed
      const chunkSize = 10;
      for (let i = 0; i < events.length; i += chunkSize) {
        const chunk = events.slice(i, i + chunkSize);
        await Promise.all(
          chunk.map(event => this.eventPublisher.publishEvent(
            event.type,
            event.data,
            event.source,
            event.correlationId,
          )),
        );
      }
    } catch (error) {
      this.logger.error(`Failed to process event group ${type}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async handleFailedBatch(): Promise<void> {
    if (this.batch.length > 0) {
      // Implement retry logic here
      // For now, just log the failed events
      this.logger.warn(`Failed to process ${this.batch.length} events`);
    }
  }

  async flushBatch(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    await this.processBatch();
  }
} 