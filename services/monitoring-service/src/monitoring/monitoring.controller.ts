import { Controller, Get } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('metrics')
  getMetrics() {
    return this.monitoringService.getMetrics();
  }

  @Get('services')
  getServices() {
    return this.monitoringService.getServices();
  }
} 