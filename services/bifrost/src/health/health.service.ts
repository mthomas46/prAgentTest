import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor() {}

  async check() {
    return {
      service: 'bifrost',
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  }
} 