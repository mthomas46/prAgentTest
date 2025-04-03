import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsDate, IsObject } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ description: 'Task title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Task description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Task status', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'User ID to assign the task to', required: false })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiProperty({ description: 'Task due date', required: false })
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: 'Task metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
