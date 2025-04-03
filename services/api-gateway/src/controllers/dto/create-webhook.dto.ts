import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsOptional, IsObject } from 'class-validator';

export class CreateWebhookDto {
  @ApiProperty({ description: 'Webhook name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Webhook URL' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Webhook event type' })
  @IsString()
  eventType: string;

  @ApiProperty({ description: 'Webhook secret for verification', required: false })
  @IsString()
  @IsOptional()
  secret?: string;

  @ApiProperty({ description: 'Webhook metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 