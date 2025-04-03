import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async checkHealth() {
    const dbStatus = await this.checkDatabase();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
      },
    };
  }

  async getVersion() {
    return {
      version: process.env.npm_package_version || '1.0.0',
      name: process.env.npm_package_name || 'task-service',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  private async checkDatabase(): Promise<string> {
    try {
      await this.dataSource.query('SELECT 1');
      return 'ok';
    } catch (error) {
      return 'error';
    }
  }
} 