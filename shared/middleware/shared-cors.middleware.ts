import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { CORS_OPTIONS } from '../constants/app.constants';

@Injectable()
export class SharedCorsMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const origin = request.headers.origin;
    const allowedOrigins = this.configService.get('cors.origins') || CORS_OPTIONS.origins;

    if (allowedOrigins.includes(origin)) {
      response.setHeader('Access-Control-Allow-Origin', origin);
      response.setHeader('Access-Control-Allow-Methods', CORS_OPTIONS.methods.join(', '));
      response.setHeader('Access-Control-Allow-Headers', CORS_OPTIONS.headers.join(', '));
      response.setHeader('Access-Control-Allow-Credentials', CORS_OPTIONS.credentials.toString());
    }

    if (request.method === 'OPTIONS') {
      response.status(204).end();
      return;
    }

    next();
  }
} 