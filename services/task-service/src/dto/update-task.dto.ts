import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IUpdateTaskDto } from '../../../../shared/interfaces/task.interface';

export class UpdateTaskDto extends PartialType(CreateTaskDto) implements IUpdateTaskDto {} 