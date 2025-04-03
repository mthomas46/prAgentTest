import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ROLES_KEY } from '../decorators/shared-roles.decorator';

@Injectable()
export class SharedRolesGuard implements CanActivate {
  private readonly logger = new Logger(SharedRolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    this.logger.debug('Checking user roles', { user, requiredRoles });

    return requiredRoles.some(role => user?.roles?.includes(role));
  }
} 