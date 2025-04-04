import { Module } from '@nestjs/common';
import { HeimdalController } from './controllers/test.controller';
import { HeimdalService } from './services/test.service';

@Module({
  imports: [],
  controllers: [HeimdalController],
  providers: [HeimdalService],
})
export class AppModule {} 