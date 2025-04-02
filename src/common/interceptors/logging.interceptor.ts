import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, userAgent } = request;
    const now = Date.now();

    this.logger.log(`[${method}] ${url} - ${ip} - ${userAgent} - Started`);

    return next.handle().pipe(
      tap({
        next: data => {
          this.logger.log(
            `[${method}] ${url} - ${ip} - ${userAgent} - Completed in ${Date.now() - now}ms`,
          );
        },
        error: error => {
          this.logger.error(`[${method}] ${url} - ${ip} - ${userAgent} - Failed: ${error.message}`);
        },
      }),
    );
  }
}
