import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsDate, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete project documentation',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Write comprehensive documentation for the project',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The status of the task',
    example: 0,
    minimum: 0,
    maximum: 4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  status?: number;

  @ApiProperty({
    description: 'The priority of the task',
    example: 1,
    minimum: 0,
    maximum: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(3)
  priority?: number;

  @ApiProperty({
    description: 'Whether the task is completed',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({
    description: 'The ID of the user assigned to the task',
    example: 'user123',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({
    description: 'The due date of the task',
    example: '2025-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiProperty({
    description: 'Additional metadata for the task',
    example: { tags: ['documentation', 'important'] },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
} 