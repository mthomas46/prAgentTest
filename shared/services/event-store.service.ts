import { Injectable, Logger } from '@nestjs/common';
import { EventRepository } from '../repositories/event.repository';
import { EventPublisherService } from './event-publisher.service';
import { EventValidatorService } from './event-validator.service';
import { EventCompressionService } from './event-compression.service';
import { IEvent, EventType } from '../interfaces/events.interface';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventStoreService {
  private readonly logger = new Logger(EventStoreService.name);
  private readonly BATCH_SIZE = 50;

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventPublisher: EventPublisherService,
    private readonly eventValidator: EventValidatorService,
    private readonly eventCompression: EventCompressionService,
  ) {}

  async storeEvent(event: IEvent): Promise<Event> {
    try {
      // Validate event
      this.eventValidator.validateEvent(event);

      // Compress event data if needed
      const compressedEvent = await this.eventCompression.compressEvent(event);

      // Store event
      const storedEvent = await this.eventRepository.save({
        ...compressedEvent,
        version: 1,
      });

      this.logger.log(`Event stored: ${event.type} (${storedEvent.id})`);
      return storedEvent;
    } catch (error) {
      this.logger.error(`Failed to store event: ${error.message}`, error.stack);
      throw error;
    }
  }

  async replayUnprocessedEvents(): Promise<void> {
    try {
      const unprocessedEvents = await this.eventRepository.findUnprocessedEvents(this.BATCH_SIZE);
      
      for (const event of unprocessedEvents) {
        try {
          // Decompress event data if needed
          const decompressedEvent = await this.eventCompression.decompressEvent(event);

          await this.eventPublisher.publishEvent(
            decompressedEvent.type as EventType,
            decompressedEvent.data,
            decompressedEvent.source,
            decompressedEvent.correlationId,
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
    } catch (error) {
      this.logger.error('Failed to replay unprocessed events', error.stack);
      throw error;
    }
  }

  async replayEventsByType(type: EventType): Promise<void> {
    try {
      const events = await this.eventRepository.findEventsByType(type, this.BATCH_SIZE);
      
      for (const event of events) {
        try {
          const decompressedEvent = await this.eventCompression.decompressEvent(event);

          await this.eventPublisher.publishEvent(
            decompressedEvent.type as EventType,
            decompressedEvent.data,
            decompressedEvent.source,
            decompressedEvent.correlationId,
          );
          
          this.logger.log(`Replayed event: ${event.type} (${event.id})`);
        } catch (error) {
          this.logger.error(
            `Failed to replay event: ${event.type} (${event.id})`,
            error.stack,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Failed to replay events of type ${type}`, error.stack);
      throw error;
    }
  }

  async replayEventsByCorrelationId(correlationId: string): Promise<void> {
    try {
      const events = await this.eventRepository.findEventsByCorrelationId(correlationId);
      
      for (const event of events) {
        try {
          const decompressedEvent = await this.eventCompression.decompressEvent(event);

          await this.eventPublisher.publishEvent(
            decompressedEvent.type as EventType,
            decompressedEvent.data,
            decompressedEvent.source,
            decompressedEvent.correlationId,
          );
          
          this.logger.log(`Replayed event: ${event.type} (${event.id})`);
        } catch (error) {
          this.logger.error(
            `Failed to replay event: ${event.type} (${event.id})`,
            error.stack,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Failed to replay events with correlation ID ${correlationId}`, error.stack);
      throw error;
    }
  }

  async cleanupOldEvents(olderThanDays = 30): Promise<void> {
    await this.eventRepository.deleteProcessedEvents(olderThanDays);
    this.logger.log(`Cleaned up events older than ${olderThanDays} days`);
  }
} 