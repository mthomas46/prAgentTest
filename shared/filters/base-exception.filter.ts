import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../types/common.types';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    const errorResponse: ErrorResponse = {
      message,
      statusCode: status,
      error: exception instanceof Error ? exception.name : 'Error',
    };

    response.status(status).json(errorResponse);
  }
} 