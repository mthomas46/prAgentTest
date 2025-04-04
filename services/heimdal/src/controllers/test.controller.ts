import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HeimdalService } from '../services/test.service';

@ApiTags('heimdal')
@Controller('heimdal')
export class HeimdalController {
  constructor(private readonly heimdalService: HeimdalService) {}

  @Get('health/:service')
  @ApiOperation({ summary: 'Check health of a specific service' })
  @ApiResponse({ status: 200, description: 'Service health status and version' })
  async checkServiceHealth(@Param('service') serviceName: string) {
    return this.heimdalService.checkServiceHealth(serviceName);
  }

  @Get('health')
  @ApiOperation({ summary: 'Check health of all services' })
  @ApiResponse({ status: 200, description: 'Health status and versions of all services' })
  async checkAllServicesHealth() {
    return this.heimdalService.checkAllServicesHealth();
  }

  @Get('services')
  @ApiOperation({ summary: 'Get list of all services' })
  @ApiResponse({ status: 200, description: 'List of all services with their versions' })
  async getSupportedServices() {
    return this.heimdalService.getSupportedServices();
  }
} 