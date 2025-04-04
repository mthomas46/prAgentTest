/**
 * Task Service Module
 * 
 * This module implements the business logic for task management operations,
 * interacting with the database through Sequelize models.
 */

import Task, { CreateTaskInput, UpdateTaskInput } from '../models/task.model';

export class TaskService {
  /**
   * Create a new task in the database
   * 
   * @param taskData - Task creation data
   * @returns Promise<Task> - The created task
   */
  async createTask(taskData: CreateTaskInput): Promise<Task> {
    return await Task.create(taskData);
  }

  /**
   * Retrieve all non-deleted tasks from the database
   * 
   * @returns Promise<Task[]> - Array of tasks ordered by creation date
   */
  async getAllTasks(): Promise<Task[]> {
    return await Task.findAll({
      where: { deletedAt: null },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Retrieve a specific task by its ID
   * 
   * @param id - Task ID
   * @returns Promise<Task | null> - The task if found, null otherwise
   */
  async getTaskById(id: number): Promise<Task | null> {
    return await Task.findByPk(id);
  }

  /**
   * Update an existing task
   * 
   * @param id - Task ID
   * @param taskData - Task update data
   * @returns Promise<Task | null> - The updated task if found, null otherwise
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
   * Soft delete a task by setting its deletedAt timestamp
   * 
   * @param id - Task ID
   * @returns Promise<boolean> - True if task was deleted, false if not found
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
   * Mark a task as completed and update its status
   * 
   * @param id - Task ID
   * @returns Promise<Task | null> - The updated task if found, null otherwise
   */
  async completeTask(id: number): Promise<Task | null> {
    return await this.updateTask(id, { 
      completed: true,
      status: 'completed'
    });
  }

  /**
   * Assign a task to a specific user
   * 
   * @param id - Task ID
   * @param userId - User ID to assign the task to
   * @returns Promise<Task | null> - The updated task if found, null otherwise
   */
  async assignTask(id: number, userId: string): Promise<Task | null> {
    return await this.updateTask(id, { assignedTo: userId });
  }
} 