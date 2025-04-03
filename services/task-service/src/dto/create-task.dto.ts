import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDate, IsBoolean, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The description of the task', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The status of the task', enum: TaskStatus, default: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.PENDING;

  @ApiProperty({ description: 'The priority of the task', enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiProperty({ description: 'The ID of the user assigned to the task', required: false })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiProperty({ description: 'The due date of the task', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: 'Additional metadata for the task', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Whether the task is completed', default: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;
} 