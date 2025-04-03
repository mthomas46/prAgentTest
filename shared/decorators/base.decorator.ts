import { SetMetadata } from '@nestjs/common';

export const BaseDecorator = (options: any) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    // Add common decorator logic here
    SetMetadata('base', options)(target, propertyKey, descriptor);
  };
}; 