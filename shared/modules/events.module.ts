import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Event } from '../entities/event.entity';
import { EventRepository } from '../repositories/event.repository';
import { EventPublisherService } from '../services/event-publisher.service';
import { EventSubscriberService } from '../services/event-subscriber.service';
import { EventStoreService } from '../services/event-store.service';
import { EventValidatorService } from '../services/event-validator.service';
import { EventCompressionService } from '../services/event-compression.service';
import { EventArchivingService } from '../services/event-archiving.service';
import { RetryService } from '../services/retry.service';
import { CachingStrategyService } from '../services/caching-strategy.service';
import { DatabasePoolService } from '../services/database-pool.service';
import { PerformanceMonitorService } from '../services/performance-monitor.service';
import { EventBatchingService } from '../services/event-batching.service';

@Module({
  imports: [
    ConfigModule,
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([Event]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('CACHE_TTL', 300),
        max: configService.get<number>('CACHE_MAX_ITEMS', 100),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    RetryService,
    EventRepository,
    EventValidatorService,
    EventCompressionService,
    EventArchivingService,
    EventPublisherService,
    EventSubscriberService,
    EventStoreService,
    CachingStrategyService,
    DatabasePoolService,
    PerformanceMonitorService,
    EventBatchingService,
  ],
  exports: [
    EventPublisherService,
    EventSubscriberService,
    EventStoreService,
    EventValidatorService,
    EventCompressionService,
    EventArchivingService,
    CachingStrategyService,
    DatabasePoolService,
    PerformanceMonitorService,
    EventBatchingService,
  ],
})
export class EventsModule {} 