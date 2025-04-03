import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedConfigService } from './shared.config';
import { validate } from './config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
      validate,
      cache: true,
    }),
  ],
  providers: [SharedConfigService],
  exports: [SharedConfigService],
})
export class SharedConfigModule {} 