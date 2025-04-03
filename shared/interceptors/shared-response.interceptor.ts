import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

export interface Response<T> {
  data: T;
  message: string;
  statusCode: number;
}

@Injectable()
export class SharedResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  private readonly logger = new Logger(SharedResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        this.logger.debug('Transforming response', { data });
        return {
          data,
          message: 'Success',
          statusCode: 200,
        };
      }),
    );
  }
} 