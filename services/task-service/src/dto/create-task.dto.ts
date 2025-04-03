import { IsString, IsOptional, IsDate, IsUUID, IsObject, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICreateTaskDto, TaskStatus } from '../../../../shared/interfaces/task.interface';

export class CreateTaskDto implements ICreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Implement user authentication',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the task',
    example: 'Implement JWT-based authentication with refresh tokens',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The current status of the task',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    default: TaskStatus.PENDING,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'The UUID of the user assigned to this task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: 'The due date for the task',
    example: '2025-12-31T23:59:59Z',
  })
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Additional metadata for the task',
    example: {
      priority: 'high',
      estimatedHours: 8,
      tags: ['backend', 'security']
    },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Whether the task is completed',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
} 