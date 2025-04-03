import { Module } from '@nestjs/common';
import { TaskModule } from './task.module';
import { CommonModule } from '../../../shared/modules/common.module';

@Module({
  imports: [
    CommonModule,
    TaskModule,
  ],
})
export class AppModule {} 