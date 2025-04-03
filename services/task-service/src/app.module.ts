import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task.module';
import { CommonModule } from '../../../shared/modules/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    CommonModule,
    TaskModule,
  ],
})
export class AppModule {} 