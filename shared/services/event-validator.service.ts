import { Injectable, Logger } from '@nestjs/common';
import { IEvent, EventType } from '../interfaces/events.interface';

@Injectable()
export class EventValidatorService {
  private readonly logger = new Logger(EventValidatorService.name);

  validateEvent(event: IEvent): void {
    this.validateEventType(event.type);
    this.validateEventData(event.data);
    this.validateSource(event.source);
    this.validateTimestamp(event.timestamp);
  }

  private validateEventType(type: EventType): void {
    if (!Object.values(EventType).includes(type)) {
      throw new Error(`Invalid event type: ${type}`);
    }
  }

  private validateEventData(data: any): void {
    if (!data) {
      throw new Error('Event data cannot be null or undefined');
    }

    if (typeof data !== 'object') {
      throw new Error('Event data must be an object');
    }

    // Validate data size
    const dataSize = JSON.stringify(data).length;
    if (dataSize > 1024 * 1024) { // 1MB limit
      throw new Error(`Event data size (${dataSize} bytes) exceeds limit of 1MB`);
    }
  }

  private validateSource(source: string): void {
    if (!source) {
      throw new Error('Event source cannot be empty');
    }

    if (source.length > 100) {
      throw new Error('Event source exceeds maximum length of 100 characters');
    }
  }

  private validateTimestamp(timestamp: Date): void {
    if (!timestamp) {
      throw new Error('Event timestamp cannot be null or undefined');
    }

    if (!(timestamp instanceof Date)) {
      throw new Error('Event timestamp must be a valid Date object');
    }

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    if (timestamp < fiveMinutesAgo || timestamp > fiveMinutesFromNow) {
      throw new Error('Event timestamp is outside acceptable range (±5 minutes)');
    }
  }
} 