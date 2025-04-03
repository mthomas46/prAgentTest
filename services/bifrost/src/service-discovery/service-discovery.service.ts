import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ServiceInfo } from './interfaces/service-info.interface';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ServiceDiscoveryService {
  private readonly logger = new Logger(ServiceDiscoveryService.name);
  private readonly services: ServiceInfo[] = [
    { name: 'task-service', url: 'http://task-service:3002', status: 'UNKNOWN' },
    { name: 'document-service', url: 'http://document-service:3003', status: 'UNKNOWN' },
    { name: 'webhook-service', url: 'http://webhook-service:3004', status: 'UNKNOWN' },
    { name: 'monitoring-service', url: 'http://monitoring-service:3005', status: 'UNKNOWN' },
  ];

  constructor(private readonly httpService: HttpService) {}

  getAllServices(): ServiceInfo[] {
    return this.services;
  }

  async checkServiceHealth(serviceName: string): Promise<ServiceInfo> {
    const service = this.services.find(s => s.name === serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    try {
      const [healthResponse, versionResponse] = await Promise.all([
        firstValueFrom(
          this.httpService.get(`${service.url}/health`).pipe(
            catchError(() => {
              service.status = 'DOWN';
              return Promise.reject(`${serviceName} health check failed`);
            })
          )
        ),
        firstValueFrom(
          this.httpService.get(`${service.url}/version`).pipe(
            catchError(() => {
              return Promise.resolve({ data: { version: 'unknown' } });
            })
          )
        ),
      ]);

      service.status = healthResponse.data.status === 'ok' ? 'UP' : 'DOWN';
      service.version = versionResponse.data.version;
      service.lastChecked = new Date();
    } catch (error) {
      service.status = 'DOWN';
      service.lastChecked = new Date();
    }

    return service;
  }

  async checkAllServices(): Promise<ServiceInfo[]> {
    const results: ServiceInfo[] = [];
    for (const serviceName of this.services.map(s => s.name)) {
      const result = await this.checkServiceHealth(serviceName);
      results.push(result);
    }
    return results;
  }

  getServiceInfo(serviceName: string): ServiceInfo {
    const service = this.services.find(s => s.name === serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }
}
