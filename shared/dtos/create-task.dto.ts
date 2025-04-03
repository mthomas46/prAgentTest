import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assignedTo?: string;
  status?: TaskStatus;
} 