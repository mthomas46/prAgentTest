import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SharedSessionMiddleware implements NestMiddleware {
  private sessionMiddleware: any;

  constructor(private configService: ConfigService) {
    const secret = this.configService.get('session.secret');
    const resave = this.configService.get('session.resave') || false;
    const saveUninitialized = this.configService.get('session.saveUninitialized') || false;
    const cookie = {
      secure: this.configService.get('session.cookie.secure') || false,
      maxAge: this.configService.get('session.cookie.maxAge') || 24 * 60 * 60 * 1000,
    };

    this.sessionMiddleware = session({
      secret,
      resave,
      saveUninitialized,
      cookie,
    });
  }

  use(request: Request, response: Response, next: NextFunction): void {
    this.sessionMiddleware(request, response, next);
  }
} 