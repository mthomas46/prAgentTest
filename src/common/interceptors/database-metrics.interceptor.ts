import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatabaseMetrics } from '../interfaces';

@Injectable()
export class DatabaseMetricsInterceptor implements NestInterceptor {
  private metrics: DatabaseMetrics = {
    queryCount: 0,
    queryTime: 0,
    errorCount: 0,
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.metrics.queryCount++;
          this.metrics.queryTime += Date.now() - startTime;
        },
        error: () => {
          this.metrics.errorCount++;
        },
      }),
    );
  }

  getMetrics(): DatabaseMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      queryCount: 0,
      queryTime: 0,
      errorCount: 0,
    };
  }
} 