import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ServiceInfo } from './interfaces/service-info.interface';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AxiosError } from 'axios';

interface HealthResponse {
  status: string;
  [key: string]: any;
}

interface VersionResponse {
  version: string;
  [key: string]: any;
}

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
      throw new HttpException(`Service ${serviceName} not found`, HttpStatus.NOT_FOUND);
    }

    try {
      const [healthResponse, versionResponse] = await Promise.all([
        firstValueFrom(
          this.httpService.get<HealthResponse>(`${service.url}/health`).pipe(
            catchError((error: AxiosError) => {
              service.status = 'DOWN';
              this.logger.error(`Health check failed for ${serviceName}: ${error.message}`);
              return Promise.reject(error);
            })
          )
        ),
        firstValueFrom(
          this.httpService.get<VersionResponse>(`${service.url}/version`).pipe(
            catchError(() => {
              this.logger.warn(`Version check failed for ${serviceName}`);
              return Promise.resolve({ data: { version: 'unknown' } });
            })
          )
        ),
      ]);

      service.status = healthResponse.data.status === 'ok' ? 'UP' : 'DOWN';
      service.version = versionResponse.data.version;
      service.lastChecked = new Date();
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      service.status = 'DOWN';
      service.lastChecked = new Date();
      this.logger.error(`Service check failed for ${serviceName}: ${axiosError.message}`);
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
      throw new HttpException(`Service ${serviceName} not found`, HttpStatus.NOT_FOUND);
    }
    return service;
  }
}
