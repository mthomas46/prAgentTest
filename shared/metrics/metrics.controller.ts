import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { register } from 'prom-client';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  @Get()
  @ApiOperation({ summary: 'Get application metrics in Prometheus format' })
  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
} 