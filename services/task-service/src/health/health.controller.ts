import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check service health' })
  async checkHealth() {
    return this.healthService.checkHealth();
  }

  @Get('version')
  @ApiOperation({ summary: 'Get service version' })
  async getVersion() {
    return this.healthService.getVersion();
  }
} 