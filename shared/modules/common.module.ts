import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { getDatabaseConfig } from '../config/database.config';
import { getMonitoringConfig } from '../config/monitoring.config';
import { LoggerModule } from '../logger/logger.module';
import { MetricsModule } from '../metrics/metrics.module';
import { HealthModule } from '../health/health.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    PrometheusModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getMonitoringConfig,
      inject: [ConfigService],
    }),
    LoggerModule,
    MetricsModule,
    HealthModule,
  ],
  exports: [
    ConfigModule,
    TypeOrmModule,
    PrometheusModule,
    LoggerModule,
    MetricsModule,
    HealthModule,
  ],
})
export class CommonModule {} 