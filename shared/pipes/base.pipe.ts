import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class BasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Add common validation logic here
    this.validate(value, metadata);
    
    return value;
  }

  protected validate(value: any, metadata: ArgumentMetadata): void {
    // Base implementation - should be overridden by child classes
  }
} 