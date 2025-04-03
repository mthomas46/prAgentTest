import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const SharedRoles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); 