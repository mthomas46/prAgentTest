import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
  private readonly allowedContentTypes = [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain'
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const contentType = req.headers['content-type'];
    
    if (contentType && !this.allowedContentTypes.some(type => contentType.includes(type))) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Invalid Content-Type header',
        error: 'Bad Request'
      });
    }

    // Sanitize Content-Type header
    if (contentType) {
      req.headers['content-type'] = this.sanitizeContentType(contentType);
    }

    next();
  }

  private sanitizeContentType(contentType: string): string {
    // Remove any additional parameters and trim whitespace
    return contentType.split(';')[0].trim();
  }
} 