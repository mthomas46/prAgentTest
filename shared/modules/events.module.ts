import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Event } from '../entities/event.entity';
import { EventRepository } from '../repositories/event.repository';
import { EventPublisherService } from '../services/event-publisher.service';
import { EventSubscriberService } from '../services/event-subscriber.service';
import { EventStoreService } from '../services/event-store.service';
import { RetryService } from '../services/retry.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Event]),
  ],
  providers: [
    RetryService,
    EventRepository,
    EventPublisherService,
    EventSubscriberService,
    EventStoreService,
  ],
  exports: [
    EventPublisherService,
    EventSubscriberService,
    EventStoreService,
  ],
})
export class EventsModule {} 