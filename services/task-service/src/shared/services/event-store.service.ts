import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event } from '../entities/event.entity';
import { IEvent, EventType } from '../interfaces/events.interface';
import { EventCompressionService } from './event-compression.service';

@Injectable()
export class EventStoreService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly eventCompression: EventCompressionService
  ) {}

  async saveEvent(event: IEvent<any>): Promise<void> {
    const compressedEvent = await this.eventCompression.compressEvent(event);
    const eventEntity = this.eventRepository.create({
      id: event.id,
      type: event.type,
      data: compressedEvent.data,
      timestamp: event.timestamp,
      metadata: event.metadata,
      version: event.version || 1
    });
    await this.eventRepository.save(eventEntity);
  }

  async getEvent(id: string): Promise<IEvent<any>> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      return null;
    }
    const decompressedEvent = await this.eventCompression.decompressEvent(event);
    return {
      id: event.id,
      type: event.type as EventType,
      data: decompressedEvent.data,
      timestamp: event.timestamp,
      metadata: event.metadata,
      version: event.version
    };
  }

  async getEventsByType(type: EventType): Promise<IEvent<any>[]> {
    const events = await this.eventRepository.find({ where: { type } });
    return Promise.all(events.map(async (event) => {
      const decompressedEvent = await this.eventCompression.decompressEvent(event);
      return {
        id: event.id,
        type: event.type as EventType,
        data: decompressedEvent.data,
        timestamp: event.timestamp,
        metadata: event.metadata,
        version: event.version
      };
    }));
  }

  async getEventsByTimeRange(startTime: Date, endTime: Date): Promise<IEvent<any>[]> {
    const events = await this.eventRepository.find({
      where: {
        timestamp: Between(startTime, endTime)
      }
    });
    return Promise.all(events.map(async (event) => {
      const decompressedEvent = await this.eventCompression.decompressEvent(event);
      return {
        id: event.id,
        type: event.type as EventType,
        data: decompressedEvent.data,
        timestamp: event.timestamp,
        metadata: event.metadata,
        version: event.version
      };
    }));
  }
} 