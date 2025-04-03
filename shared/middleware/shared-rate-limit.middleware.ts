import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { RATE_LIMIT_OPTIONS } from '../constants/app.constants';
import * as rateLimit from 'express-rate-limit';

@Injectable()
export class SharedRateLimitMiddleware implements NestMiddleware {
  private limiter: any;

  constructor(private configService: ConfigService) {
    const windowMs = this.configService.get('rateLimit.windowMs') || RATE_LIMIT_OPTIONS.windowMs;
    const max = this.configService.get('rateLimit.max') || RATE_LIMIT_OPTIONS.max;

    this.limiter = rateLimit({
      windowMs,
      max,
      message: {
        message: 'Too many requests, please try again later.',
        statusCode: 429,
      },
    });
  }

  use(request: Request, response: Response, next: NextFunction): void {
    this.limiter(request, response, next);
  }
} 