import { Task, TaskPriority } from '../../services/task-service/src/task.entity';
import { TaskStatus } from '../../shared/interfaces/task.interface';

export const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  assignedTo: 'user1',
  dueDate: new Date(),
  metadata: {},
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
};

export const mockCreateTaskDto = {
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  assignedTo: 'user1',
  dueDate: new Date(),
  metadata: {},
  completed: false
}; 