import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../enums/task-status.enum';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: any) {
    const status = parseInt(value);
    if (isNaN(status)) {
      throw new BadRequestException(`"${value}" is not a valid status`);
    }
    
    if (!Object.values(TaskStatus).includes(status)) {
      throw new BadRequestException(`"${status}" is not a valid status`);
    }
    
    return status;
  }
} 