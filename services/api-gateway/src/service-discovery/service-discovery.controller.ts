import { Controller, Get, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('service-discovery')
@Controller('service-discovery')
export class ServiceDiscoveryController {
  constructor(
    @Inject('SERVICE_DISCOVERY') private readonly serviceDiscoveryClient: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new service' })
  @ApiResponse({ status: 201, description: 'Service registered successfully' })
  async registerService(@Body() service: any) {
    return this.serviceDiscoveryClient.send('register_service', service);
  }

  @Get('services')
  @ApiOperation({ summary: 'Get all registered services' })
  @ApiResponse({ status: 200, description: 'Return all registered services' })
  async findAllServices() {
    return this.serviceDiscoveryClient.send('find_all_services', {});
  }

  @Get('services/:id')
  @ApiOperation({ summary: 'Get a service by id' })
  @ApiResponse({ status: 200, description: 'Return the service' })
  async findOneService(@Param('id') id: string) {
    return this.serviceDiscoveryClient.send('find_one_service', { id });
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Unregister a service' })
  @ApiResponse({ status: 200, description: 'Service unregistered successfully' })
  async unregisterService(@Param('id') id: string) {
    return this.serviceDiscoveryClient.send('unregister_service', { id });
  }

  @Get('health')
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({ status: 200, description: 'Return health status' })
  async getHealth() {
    return this.serviceDiscoveryClient.send('get_health', {});
  }
}
