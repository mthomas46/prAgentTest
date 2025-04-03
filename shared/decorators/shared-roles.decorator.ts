import { SetMetadata } from '@nestjs/common';

export enum SharedRoles {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: SharedRoles[]) => SetMetadata(ROLES_KEY, roles); 