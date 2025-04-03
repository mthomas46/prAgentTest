import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DatabasePoolService } from './database-pool.service';
import { CachingStrategyService } from './caching-strategy.service';

export interface PerformanceMetrics {
  timestamp: string;
  database: {
    connections: number;
    idleConnections: number;
    waitingClients: number;
  };
  cache: {
    hits: number;
    misses: number;
    size: number;
  };
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  cpu: {
    user: number;
    system: number;
  };
}

@Injectable()
export class PerformanceMonitorService {
  private readonly logger = new Logger(PerformanceMonitorService.name);
  private metrics: PerformanceMetrics[] = [];
  private readonly MAX_METRICS = 1000;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly databasePool: DatabasePoolService,
    private readonly cachingStrategy: CachingStrategyService,
  ) {
    this.startMonitoring();
  }

  private startMonitoring() {
    setInterval(async () => {
      try {
        const metrics = await this.collectMetrics();
        this.metrics.push(metrics);
        
        if (this.metrics.length > this.MAX_METRICS) {
          this.metrics = this.metrics.slice(-this.MAX_METRICS);
        }

        this.eventEmitter.emit('performance.metrics', metrics);
      } catch (error) {
        this.logger.error(`Failed to collect metrics: ${error.message}`, error.stack);
      }
    }, 60000); // Collect metrics every minute
  }

  private async collectMetrics(): Promise<PerformanceMetrics> {
    const dbStats = await this.databasePool.getConnectionStats();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      timestamp: new Date().toISOString(),
      database: {
        connections: dbStats.totalConnections,
        idleConnections: dbStats.idleConnections,
        waitingClients: dbStats.waitingClients,
      },
      cache: {
        hits: 0, // TODO: Implement cache hit/miss tracking
        misses: 0,
        size: 0,
      },
      memory: {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
    };
  }

  getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  getMetricsByTimeRange(start: Date, end: Date): PerformanceMetrics[] {
    return this.metrics.filter(
      metric => new Date(metric.timestamp) >= start && new Date(metric.timestamp) <= end,
    );
  }

  clearMetrics(): void {
    this.metrics = [];
  }
} 