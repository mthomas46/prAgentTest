import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BaseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Add common request processing here
    this.processRequest(req);
    
    // Add common response processing here
    this.processResponse(res);
    
    next();
  }

  protected processRequest(req: Request): void {
    // Base implementation - should be overridden by child classes
  }

  protected processResponse(res: Response): void {
    // Base implementation - should be overridden by child classes
  }
} 