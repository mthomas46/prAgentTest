import { Module } from '@nestjs/common';
import { LokiController } from './controllers/loki.controller';
import { LokiService } from './services/loki.service';

@Module({
  imports: [],
  controllers: [LokiController],
  providers: [LokiService],
})
export class AppModule {} 