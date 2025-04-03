import { Injectable, Logger } from '@nestjs/common';
import { EventRepository } from '../repositories/event.repository';
import { EventPublisherService } from './event-publisher.service';
import { IEvent, EventType } from '../interfaces/events.interface';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventStoreService {
  private readonly logger = new Logger(EventStoreService.name);

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  async storeEvent(event: IEvent): Promise<Event> {
    const storedEvent = await this.eventRepository.save({
      type: event.type,
      data: event.data,
      source: event.source,
      correlationId: event.correlationId,
    });

    this.logger.log(`Event stored: ${event.type} (${storedEvent.id})`);
    return storedEvent;
  }

  async replayUnprocessedEvents(): Promise<void> {
    const unprocessedEvents = await this.eventRepository.findUnprocessedEvents();
    
    for (const event of unprocessedEvents) {
      try {
        await this.eventPublisher.publishEvent(
          event.type as EventType,
          event.data,
          event.source,
          event.correlationId,
        );
        
        await this.eventRepository.markAsProcessed(event.id);
        this.logger.log(`Replayed event: ${event.type} (${event.id})`);
      } catch (error) {
        await this.eventRepository.incrementRetryCount(event.id);
        this.logger.error(
          `Failed to replay event: ${event.type} (${event.id})`,
          error.stack,
        );
      }
    }
  }

  async replayEventsByType(type: EventType): Promise<void> {
    const events = await this.eventRepository.findEventsByType(type);
    
    for (const event of events) {
      try {
        await this.eventPublisher.publishEvent(
          event.type as EventType,
          event.data,
          event.source,
          event.correlationId,
        );
        
        this.logger.log(`Replayed event: ${event.type} (${event.id})`);
      } catch (error) {
        this.logger.error(
          `Failed to replay event: ${event.type} (${event.id})`,
          error.stack,
        );
      }
    }
  }

  async replayEventsByCorrelationId(correlationId: string): Promise<void> {
    const events = await this.eventRepository.findEventsByCorrelationId(correlationId);
    
    for (const event of events) {
      try {
        await this.eventPublisher.publishEvent(
          event.type as EventType,
          event.data,
          event.source,
          event.correlationId,
        );
        
        this.logger.log(`Replayed event: ${event.type} (${event.id})`);
      } catch (error) {
        this.logger.error(
          `Failed to replay event: ${event.type} (${event.id})`,
          error.stack,
        );
      }
    }
  }

  async cleanupOldEvents(olderThanDays = 30): Promise<void> {
    await this.eventRepository.deleteProcessedEvents(olderThanDays);
    this.logger.log(`Cleaned up events older than ${olderThanDays} days`);
  }
} 