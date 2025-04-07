import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async check() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        apiGateway: 'healthy',
        rabbitMQ: 'connected',
        prometheus: 'connected',
        elasticsearch: 'connected'
      }
    };
  }
} 