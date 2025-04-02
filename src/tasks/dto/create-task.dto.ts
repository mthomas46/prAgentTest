import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '../../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({
    example: 'uuid-v4',
    description: 'The unique identifier of the task',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Buy groceries', description: 'The title of the task' })
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @ApiProperty({ example: 'Buy milk and bread', description: 'The description of the task' })
  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @ApiProperty({
    example: TaskPriority.MEDIUM,
    description: 'The priority of the task',
    enum: TaskPriority,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: `Invalid priority value. Valid values are: ${Object.values(TaskPriority).join(', ')}` })
  priority?: TaskPriority;

  @ApiProperty({
    example: '2024-04-02T10:00:00Z',
    description: 'The due date of the task',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format. Please use ISO 8601 format (e.g., 2024-04-02T10:00:00Z)' })
  dueDate?: Date;

  @ApiProperty({ example: false, description: 'Whether the task is completed' })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
