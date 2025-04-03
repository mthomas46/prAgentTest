import { IsString, IsOptional, IsDate, IsUUID, IsObject, IsEnum } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto, TaskStatus } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'The updated title of the task',
    example: 'Implement OAuth2 authentication',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The updated description of the task',
    example: 'Implement OAuth2 authentication with Google and GitHub providers',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The updated status of the task',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: 'The UUID of the new user assigned to this task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiProperty({
    description: 'The updated due date for the task',
    example: '2025-12-31T23:59:59Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({
    description: 'Updated metadata for the task',
    example: {
      priority: 'medium',
      estimatedHours: 12,
      tags: ['backend', 'security', 'oauth']
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 