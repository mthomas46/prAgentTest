import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Document title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Document content', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'Document metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 