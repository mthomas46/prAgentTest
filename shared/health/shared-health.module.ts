import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sharedConfig } from '../config/shared.config';
import { SharedHealthController } from './shared-health.controller';
import { SharedHealthService } from './shared-health.service';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forFeature(sharedConfig),
  ],
  controllers: [SharedHealthController],
  providers: [SharedHealthService],
  exports: [SharedHealthService],
})
export class SharedHealthModule {} 