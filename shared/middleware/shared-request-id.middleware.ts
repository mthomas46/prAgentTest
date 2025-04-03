import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SharedRequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = request.headers['x-request-id'] || uuidv4();
    request.headers['x-request-id'] = requestId;
    response.setHeader('x-request-id', requestId);
    next();
  }
} 