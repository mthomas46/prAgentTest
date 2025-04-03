import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SharedExceptionFilter } from './shared-exception.filter';
import { SharedValidationFilter } from './shared-validation.filter';
import { SharedHttpExceptionFilter } from './shared-http-exception.filter';
import { SharedRpcExceptionFilter } from './shared-rpc-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: SharedExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: SharedValidationFilter,
    },
    {
      provide: APP_FILTER,
      useClass: SharedHttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: SharedRpcExceptionFilter,
    },
  ],
  exports: [
    SharedExceptionFilter,
    SharedValidationFilter,
    SharedHttpExceptionFilter,
    SharedRpcExceptionFilter,
  ],
})
export class SharedFiltersModule {} 