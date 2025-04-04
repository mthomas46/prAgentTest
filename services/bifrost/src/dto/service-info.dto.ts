import { ApiProperty } from '@nestjs/swagger';

export class ServiceInfoDto {
  @ApiProperty({ description: 'Name of the service' })
  name: string;

  @ApiProperty({ description: 'URL of the service' })
  url: string;

  @ApiProperty({ description: 'Current status of the service', enum: ['UP', 'DOWN', 'UNKNOWN'] })
  status: 'UP' | 'DOWN' | 'UNKNOWN';

  @ApiProperty({ description: 'Version of the service', required: false })
  version?: string;

  @ApiProperty({ description: 'Last time the service was checked', required: false })
  lastChecked?: Date;
} 