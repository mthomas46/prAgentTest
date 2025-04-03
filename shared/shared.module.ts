/**
 * Root module that consolidates all shared functionality across microservices.
 * This module provides a centralized way to import common features like configuration,
 * middleware, interceptors, filters, guards, and pipes.
 * 
 * @module SharedModule
 */
import { Module } from '@nestjs/common';
import { SharedConfigModule } from './config/shared-config.module';
import { SharedDatabaseModule } from './database/shared-database.module';
import { SharedRabbitMQModule } from './rabbitmq/shared-rabbitmq.module';
import { SharedRedisModule } from './redis/shared-redis.module';
import { SharedElasticsearchModule } from './elasticsearch/shared-elasticsearch.module';
import { SharedPrometheusModule } from './prometheus/shared-prometheus.module';
import { SharedLoggingModule } from './logging/shared-logging.module';
import { SharedHealthModule } from './health/shared-health.module';
import { SharedMiddlewareModule } from './middleware/shared-middleware.module';
import { SharedGuardsModule } from './guards/shared-guards.module';
import { SharedInterceptorsModule } from './interceptors/shared-interceptors.module';
import { SharedFiltersModule } from './filters/shared-filters.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';

/**
 * Main shared module that exports all common functionality.
 * Import this module in your service's root module to access all shared features.
 * 
 * @example
 * ```typescript
 * @Module({
 *   imports: [SharedModule],
 *   // ... other module configuration
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [
    SharedConfigModule,
    SharedDatabaseModule,
    SharedRabbitMQModule,
    SharedRedisModule,
    SharedElasticsearchModule,
    SharedPrometheusModule,
    SharedLoggingModule,
    SharedHealthModule,
    SharedMiddlewareModule,
    SharedGuardsModule,
    SharedInterceptorsModule,
    SharedFiltersModule,
    SharedPipesModule,
  ],
  exports: [
    SharedConfigModule,
    SharedDatabaseModule,
    SharedRabbitMQModule,
    SharedRedisModule,
    SharedElasticsearchModule,
    SharedPrometheusModule,
    SharedLoggingModule,
    SharedHealthModule,
    SharedMiddlewareModule,
    SharedGuardsModule,
    SharedInterceptorsModule,
    SharedFiltersModule,
    SharedPipesModule,
  ],
})
export class SharedModule {} 