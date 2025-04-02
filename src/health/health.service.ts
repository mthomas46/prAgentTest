import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async check() {
    const healthCheck = await this.health.check([
      // Database health check
      async () => {
        try {
          await this.connection.query('SELECT 1');
          return {
            database: {
              status: 'up',
              timestamp: new Date().toISOString(),
            },
          };
        } catch (error) {
          return {
            database: {
              status: 'down',
              error: error.message,
              timestamp: new Date().toISOString(),
            },
          };
        }
      },
      // Memory usage check
      async () => {
        const used = process.memoryUsage();
        return {
          memory: {
            status: 'up',
            heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
            timestamp: new Date().toISOString(),
          },
        };
      },
      // Uptime check
      async () => {
        return {
          uptime: {
            status: 'up',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
          },
        };
      },
    ]);

    const isHealthy = Object.values(healthCheck).every(check => check.status === 'up');

    return {
      status: isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      details: healthCheck,
    };
  }
}
