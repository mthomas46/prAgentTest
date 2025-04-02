import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
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
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Buy milk and bread', description: 'The description of the task' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: TaskPriority.MEDIUM,
    description: 'The priority of the task',
    enum: TaskPriority,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    example: '2024-04-02T10:00:00Z',
    description: 'The due date of the task',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
