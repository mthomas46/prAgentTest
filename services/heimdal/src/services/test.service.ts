import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ServiceInfo } from '../interfaces/service-info.interface';

/**
 * Heimdal Service
 * Named after the Norse god Heimdall, the watchman of the gods who guards the Bifrost bridge.
 * This service watches over the entire application, providing immediate health status and version information for all services.
 * Like its namesake, it stands at the edge of the system, monitoring all services and alerting when issues arise.
 */
@Injectable()
export class HeimdalService {
  private readonly services: ServiceInfo[] = [
    {
      name: 'task-service',
      url: 'http://localhost:3000',
      healthEndpoint: '/health',
      version: '1.0.0'
    },
    {
      name: 'bifrost',
      url: 'http://localhost:3001',
      healthEndpoint: '/health',
      version: '1.0.0'
    },
    {
      name: 'ui-service',
      url: 'http://localhost:3002',
      healthEndpoint: '/health',
      version: '1.0.0'
    },
    {
      name: 'document-service',
      url: 'http://localhost:3004',
      healthEndpoint: '/health',
      version: '1.0.0'
    },
    {
      name: 'monitoring-service',
      url: 'http://localhost:3005',
      healthEndpoint: '/health',
      version: '1.0.0'
    },
  ];

  async checkServiceHealth(serviceName: string): Promise<{ status: string; response: any; version?: string }> {
    const service = this.services.find(s => s.name === serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    try {
      const response = await axios.get(`${service.url}${service.healthEndpoint}`);
      return {
        status: 'healthy',
        response: response.data,
        version: service.version
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        response: error.response?.data || error.message,
        version: service.version
      };
    }
  }

  async checkAllServicesHealth(): Promise<Record<string, { status: string; response: any; version?: string }>> {
    const results: Record<string, { status: string; response: any; version?: string }> = {};
    
    for (const service of this.services) {
      results[service.name] = await this.checkServiceHealth(service.name);
    }

    return results;
  }

  getSupportedServices(): ServiceInfo[] {
    return this.services;
  }
} 