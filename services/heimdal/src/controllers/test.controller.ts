import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HeimdalService } from '../services/test.service';

@ApiTags('heimdal')
@Controller('heimdal')
export class HeimdalController {
  constructor(private readonly heimdalService: HeimdalService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check health of Heimdal service' })
  @ApiResponse({ status: 200, description: 'Heimdal service health status' })
  async checkHeimdalHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'heimdal',
      version: '1.0.0'
    };
  }

  @Get('services/health')
  @ApiOperation({ summary: 'Check health of all services' })
  @ApiResponse({ status: 200, description: 'Health status of all services' })
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