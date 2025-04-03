import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  dueDate?: Date;
  metadata?: Record<string, any>;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
} 