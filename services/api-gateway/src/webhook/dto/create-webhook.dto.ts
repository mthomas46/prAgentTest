import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateWebhookDto {
  @ApiProperty({
    description: 'The URL where the webhook will send events',
    example: 'https://api.example.com/webhook',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'The type of events to listen for',
    example: 'task.created',
    enum: ['task.created', 'task.updated', 'task.deleted'],
  })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty({
    description: 'Optional secret for webhook signature verification',
    example: 'your-secret-key',
    required: false,
  })
  @IsString()
  @IsOptional()
  secret?: string;
} 