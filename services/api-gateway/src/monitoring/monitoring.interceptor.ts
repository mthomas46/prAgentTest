import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.monitoringService.trackRequest(
            request.method,
            request.path,
            response.statusCode,
            duration,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.monitoringService.trackError(error, request.path);
          this.monitoringService.trackRequest(
            request.method,
            request.path,
            response.statusCode,
            duration,
          );
        },
      }),
    );
  }
} 