import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface ServiceInfo {
  name: string;
  url: string;
  version: string;
  status: string;
  lastChecked: Date;
}

@Injectable()
export class ServiceDiscoveryService {
  private readonly logger = new Logger(ServiceDiscoveryService.name);
  private services: Map<string, ServiceInfo> = new Map();

  constructor(private readonly httpService: HttpService) {
    this.initializeServices();
  }

  private initializeServices() {
    this.services.set('api-gateway', {
      name: 'api-gateway',
      url: `http://api-gateway:${process.env.PORT || 3000}`,
      version: '',
      status: 'unknown',
      lastChecked: new Date(),
    });

    this.services.set('document-service', {
      name: 'document-service',
      url: 'http://document-service:3001',
      version: '',
      status: 'unknown',
      lastChecked: new Date(),
    });

    this.services.set('task-service', {
      name: 'task-service',
      url: 'http://task-service:3002',
      version: '',
      status: 'unknown',
      lastChecked: new Date(),
    });

    this.services.set('webhook-service', {
      name: 'webhook-service',
      url: 'http://webhook-service:3003',
      version: '',
      status: 'unknown',
      lastChecked: new Date(),
    });

    this.services.set('monitoring-service', {
      name: 'monitoring-service',
      url: 'http://monitoring-service:3004',
      version: '',
      status: 'unknown',
      lastChecked: new Date(),
    });
  }

  async checkServiceHealth(serviceName: string): Promise<ServiceInfo> {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    try {
      const healthResponse = await firstValueFrom(this.httpService.get(`${service.url}/health`));
      const versionResponse = await firstValueFrom(
        this.httpService.get(`${service.url}/health/version`),
      );

      service.status = healthResponse.data.status;
      service.version = versionResponse.data.version;
      service.lastChecked = new Date();

      this.logger.log(`Service ${serviceName} is ${service.status}`);
      return service;
    } catch (error) {
      service.status = 'error';
      service.lastChecked = new Date();
      this.logger.error(`Failed to check health of ${serviceName}: ${error.message}`);
      return service;
    }
  }

  async checkAllServices(): Promise<ServiceInfo[]> {
    const results: ServiceInfo[] = [];
    for (const serviceName of this.services.keys()) {
      const result = await this.checkServiceHealth(serviceName);
      results.push(result);
    }
    return results;
  }

  getServiceInfo(serviceName: string): ServiceInfo {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }

  getAllServices(): ServiceInfo[] {
    return Array.from(this.services.values());
  }
}
