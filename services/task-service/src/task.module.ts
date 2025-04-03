import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { EventPublisherService } from '../../../shared/services/event-publisher.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../../../shared/filters/http-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [
    TaskService,
    EventPublisherService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class TaskModule {} 