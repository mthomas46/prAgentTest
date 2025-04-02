import { Controller, Get } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get application metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved successfully' })
  getMetrics() {
    return this.monitoringService.getMetrics();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get application status' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
  getStatus() {
    return this.monitoringService.getStatus();
  }
}
