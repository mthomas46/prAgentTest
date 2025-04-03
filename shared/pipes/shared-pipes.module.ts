import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { SharedValidationPipe } from './shared-validation.pipe';
import { SharedParseIntPipe } from './shared-parse-int.pipe';
import { SharedParseBoolPipe } from './shared-parse-bool.pipe';
import { SharedParseArrayPipe } from './shared-parse-array.pipe';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: SharedValidationPipe,
    },
    SharedParseIntPipe,
    SharedParseBoolPipe,
    SharedParseArrayPipe,
  ],
  exports: [
    SharedValidationPipe,
    SharedParseIntPipe,
    SharedParseBoolPipe,
    SharedParseArrayPipe,
  ],
})
export class SharedPipesModule {} 