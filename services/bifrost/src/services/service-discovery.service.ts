import { Injectable } from '@nestjs/common';
import { ServiceInfo } from '../interfaces/service-info.interface';

@Injectable()
export class ServiceDiscoveryService {
  private services: Map<string, ServiceInfo> = new Map();

  async getAllServices(): Promise<ServiceInfo[]> {
    return Array.from(this.services.values());
  }

  async getService(id: string): Promise<ServiceInfo> {
    const service = this.services.get(id);
    if (!service) {
      throw new Error(`Service with ID ${id} not found`);
    }
    return service;
  }

  async registerService(serviceInfo: ServiceInfo): Promise<ServiceInfo> {
    this.services.set(serviceInfo.id, serviceInfo);
    return serviceInfo;
  }
} 