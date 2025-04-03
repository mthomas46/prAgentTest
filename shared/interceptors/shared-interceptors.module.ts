import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SharedResponseInterceptor } from './shared-response.interceptor';
import { SharedLoggingInterceptor } from './shared-logging.interceptor';
import { SharedTimeoutInterceptor } from './shared-timeout.interceptor';
import { SharedCacheInterceptor } from './shared-cache.interceptor';
import { SharedMetricsInterceptor } from './shared-metrics.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SharedResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SharedLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SharedTimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SharedCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SharedMetricsInterceptor,
    },
  ],
})
export class SharedInterceptorsModule {} 