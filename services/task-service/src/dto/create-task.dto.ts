import { IsString, IsOptional, IsDate, IsUUID, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 