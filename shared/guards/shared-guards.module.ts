import { Module } from '@nestjs/common';
import { SharedAuthGuard } from './shared-auth.guard';
import { SharedRolesGuard } from './shared-roles.guard';

@Module({
  providers: [SharedAuthGuard, SharedRolesGuard],
  exports: [SharedAuthGuard, SharedRolesGuard],
})
export class SharedGuardsModule {} 