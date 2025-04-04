import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class RouteRequestDto {
  @ApiProperty({ description: 'Target service name' })
  @IsString()
  @IsNotEmpty()
  service: string;

  @ApiProperty({ description: 'HTTP method' })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ description: 'Endpoint path' })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({ description: 'Request headers', required: false })
  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;

  @ApiProperty({ description: 'Request body', required: false })
  @IsObject()
  @IsOptional()
  body?: any;

  @ApiProperty({ description: 'Query parameters', required: false })
  @IsObject()
  @IsOptional()
  query?: Record<string, string>;
} 