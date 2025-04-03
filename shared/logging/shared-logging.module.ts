import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { sharedConfig } from '../config/shared.config';
import { LOGGER_OPTIONS } from '../constants/app.constants';

@Module({
  imports: [
    ConfigModule.forFeature(sharedConfig),
    WinstonModule.forRootAsync({
      imports: [ConfigModule.forFeature(sharedConfig)],
      useFactory: (configService: ConfigService) => ({
        level: configService.get('logging.level') || LOGGER_OPTIONS.level,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [WinstonModule],
})
export class SharedLoggingModule {} 