import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EventType } from '../interfaces/events.interface';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  async save(event: Partial<Event>): Promise<Event> {
    return this.repository.save(event);
  }

  async findUnprocessedEvents(limit = 100): Promise<Event[]> {
    return this.repository.find({
      where: { processed: false },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }

  async findEventsByType(type: EventType, limit = 100): Promise<Event[]> {
    return this.repository.find({
      where: { type },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }

  async findEventsByCorrelationId(correlationId: string): Promise<Event[]> {
    return this.repository.find({
      where: { correlationId },
      order: { createdAt: 'ASC' },
    });
  }

  async markAsProcessed(id: string, error?: string): Promise<void> {
    await this.repository.update(id, {
      processed: true,
      processedAt: new Date(),
      error,
    });
  }

  async incrementRetryCount(id: string): Promise<void> {
    await this.repository.increment({ id }, 'retryCount', 1);
  }

  async deleteProcessedEvents(olderThanDays = 30): Promise<void> {
    const date = new Date();
    date.setDate(date.getDate() - olderThanDays);
    
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(Event)
      .where('processed = true AND createdAt < :date', { date })
      .execute();
  }
} 