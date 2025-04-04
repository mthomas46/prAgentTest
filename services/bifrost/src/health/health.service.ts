import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor() {}

  async checkHealth() {
    return {
      service: 'bifrost',
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  }
} 