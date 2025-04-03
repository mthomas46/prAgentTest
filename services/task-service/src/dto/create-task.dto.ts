import { IsString, IsOptional, IsDate, IsUUID, IsObject, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Implement user authentication',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'A detailed description of the task',
    example: 'Implement JWT-based authentication with refresh tokens',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The current status of the task',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    default: TaskStatus.PENDING,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: 'The UUID of the user assigned to this task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiProperty({
    description: 'The due date for the task',
    example: '2025-12-31T23:59:59Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({
    description: 'Additional metadata for the task',
    example: {
      priority: 'high',
      estimatedHours: 8,
      tags: ['backend', 'security']
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 