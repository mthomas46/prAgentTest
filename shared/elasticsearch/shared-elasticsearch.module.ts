import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sharedConfig } from '../config/shared.config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule.forFeature(sharedConfig)],
      useFactory: (configService: ConfigService) => ({
        node: `http://${configService.get('shared.elasticsearch.host')}:${configService.get('shared.elasticsearch.port')}`,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ElasticsearchModule],
})
export class SharedElasticsearchModule {} 