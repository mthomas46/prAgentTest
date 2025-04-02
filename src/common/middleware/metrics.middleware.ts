import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../services/metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();

    res.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(start);
      const duration = seconds + nanoseconds / 1e9;

      this.metricsService.incrementHttpRequests(
        req.method,
        req.path,
        res.statusCode,
      );

      this.metricsService.observeHttpRequestDuration(
        req.method,
        req.path,
        duration,
      );
    });

    next();
  }
} 