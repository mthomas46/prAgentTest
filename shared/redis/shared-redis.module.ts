import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sharedConfig } from '../config/shared.config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule.forFeature(sharedConfig)],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get('shared.redis.host'),
          port: configService.get('shared.redis.port'),
          password: configService.get('shared.redis.password'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RedisModule],
})
export class SharedRedisModule {} 