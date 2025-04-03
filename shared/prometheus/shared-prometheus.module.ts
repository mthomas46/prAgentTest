import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sharedConfig } from '../config/shared.config';

@Module({
  imports: [
    PrometheusModule.registerAsync({
      imports: [ConfigModule.forFeature(sharedConfig)],
      useFactory: (configService: ConfigService) => ({
        path: '/metrics',
        defaultMetrics: {
          enabled: true,
        },
        defaultLabels: {
          app: 'microservices',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [PrometheusModule],
})
export class SharedPrometheusModule {} 