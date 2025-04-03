import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SharedAuthGuard implements CanActivate {
  private readonly logger = new Logger(SharedAuthGuard.name);

  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('No token provided');
      return false;
    }

    try {
      // Add your token validation logic here
      // For example, using JWT verification
      return true;
    } catch (error) {
      this.logger.error('Token validation failed', error);
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 