import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceResponse } from '../types/common.types';

@Injectable()
export class BaseInterceptor<T> implements NestInterceptor<T, ServiceResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ServiceResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        data,
        message: 'Success',
        statusCode: 200,
      })),
    );
  }
} 