import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceDiscoveryService } from '../service-discovery/service-discovery.service';
import { ServiceInfo } from '../service-discovery/interfaces/service-info.interface';

@ApiTags('service-discovery')
@Controller('service-discovery')
export class ServiceDiscoveryController {
  constructor(private readonly serviceDiscoveryService: ServiceDiscoveryService) {}

  @Get()
  async getAllServices(): Promise<ServiceInfo[]> {
    return this.serviceDiscoveryService.getAllServices();
  }

  @Get(':serviceName/health')
  async checkServiceHealth(@Param('serviceName') serviceName: string): Promise<ServiceInfo> {
    return this.serviceDiscoveryService.checkServiceHealth(serviceName);
  }
}
