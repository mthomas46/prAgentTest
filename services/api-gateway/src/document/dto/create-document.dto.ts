import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'The title of the document',
    example: 'API Documentation',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The content of the document',
    example: 'This document describes the API endpoints...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The type of document',
    example: 'markdown',
    enum: ['markdown', 'text', 'html'],
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Tags associated with the document',
    example: ['api', 'documentation', 'v1'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Version of the document',
    example: '1.0.0',
    required: false,
  })
  @IsString()
  @IsOptional()
  version?: string;
} 