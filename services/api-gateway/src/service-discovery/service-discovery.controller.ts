import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServiceDiscoveryService } from './service-discovery.service';

@ApiTags('service-discovery')
@Controller('service-discovery')
export class ServiceDiscoveryController {
  constructor(private readonly serviceDiscoveryService: ServiceDiscoveryService) {}

  @Get('services')
  @ApiOperation({ summary: 'Get all registered services' })
  @ApiResponse({ status: 200, description: 'Returns all registered services' })
  async getAllServices() {
    return this.serviceDiscoveryService.getAllServices();
  }

  @Get('services/:name')
  @ApiOperation({ summary: 'Get service information by name' })
  @ApiResponse({ status: 200, description: 'Returns service information' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async getServiceInfo(@Param('name') name: string) {
    return this.serviceDiscoveryService.getServiceInfo(name);
  }

  @Get('health')
  @ApiOperation({ summary: 'Check health of all services' })
  @ApiResponse({ status: 200, description: 'Returns health status of all services' })
  async checkAllServices() {
    return this.serviceDiscoveryService.checkAllServices();
  }

  @Get('health/:name')
  @ApiOperation({ summary: 'Check health of a specific service' })
  @ApiResponse({ status: 200, description: 'Returns health status of the service' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async checkServiceHealth(@Param('name') name: string) {
    return this.serviceDiscoveryService.checkServiceHealth(name);
  }
} 