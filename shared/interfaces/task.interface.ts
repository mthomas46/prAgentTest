export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: string;
  dueDate?: Date;
  metadata?: Record<string, any>;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: string;
  dueDate?: Date;
  metadata?: Record<string, any>;
  completed?: boolean;
}

export interface IUpdateTaskDto extends Partial<ICreateTaskDto> {} 