import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsOptional } from 'class-validator';

export class UpdateWebhookDto {
  @ApiProperty({ description: 'The name of the webhook', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The URL to send webhook events to', required: false })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'Description of the webhook', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
