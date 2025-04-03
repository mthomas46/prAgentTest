import Task, { CreateTaskInput, UpdateTaskInput } from '../models/task.model';

export class TaskService {
  /**
   * Create a new task
   */
  async createTask(taskData: CreateTaskInput): Promise<Task> {
    return await Task.create(taskData);
  }

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    return await Task.findAll({
      where: { deletedAt: null },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Get a task by ID
   */
  async getTaskById(id: number): Promise<Task | null> {
    return await Task.findByPk(id);
  }

  /**
   * Update a task
   */
  async updateTask(id: number, taskData: UpdateTaskInput): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) {
      return null;
    }
    
    await task.update(taskData);
    return task;
  }

  /**
   * Delete a task (soft delete)
   */
  async deleteTask(id: number): Promise<boolean> {
    const task = await this.getTaskById(id);
    if (!task) {
      return false;
    }
    
    await task.destroy();
    return true;
  }

  /**
   * Mark a task as completed
   */
  async completeTask(id: number): Promise<Task | null> {
    return await this.updateTask(id, { 
      completed: true,
      status: 'completed'
    });
  }

  /**
   * Assign a task to a user
   */
  async assignTask(id: number, userId: string): Promise<Task | null> {
    return await this.updateTask(id, { assignedTo: userId });
  }
} 