/**
 * Task Controller Module
 * 
 * This module handles HTTP requests for task management operations,
 * delegating business logic to the TaskService and returning appropriate responses.
 */

import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { CreateTaskInput, UpdateTaskInput } from '../models/task.model';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * Create a new task
   * 
   * @param req - Express request containing task data in body
   * @param res - Express response
   * @returns Promise<void>
   * 
   * HTTP 201 - Task created successfully
   * HTTP 500 - Server error
   */
  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskData: CreateTaskInput = req.body;
      const task = await this.taskService.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error creating task', error });
    }
  };

  /**
   * Retrieve all tasks
   * 
   * @param _req - Express request
   * @param res - Express response
   * @returns Promise<void>
   * 
   * HTTP 200 - Tasks retrieved successfully
   * HTTP 500 - Server error
   */
  getAllTasks = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  };

  /**
   * Retrieve a specific task by ID
   * 
   * @param req - Express request containing task ID in params
   * @param res - Express response
   * @returns Promise<void>
   * 
   * HTTP 200 - Task retrieved successfully
   * HTTP 404 - Task not found
   * HTTP 500 - Server error
   */
  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const task = await this.taskService.getTaskById(id);
      
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task', error });
    }
  };

  /**
   * Update an existing task
   * 
   * @param req - Express request containing task ID in params and update data in body
   * @param res - Express response
   * @returns Promise<void>
   * 
   * HTTP 200 - Task updated successfully
   * HTTP 404 - Task not found
   * HTTP 500 - Server error
   */
  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const taskData: UpdateTaskInput = req.body;
      const task = await this.taskService.updateTask(id, taskData);
      
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error updating task', error });
    }
  };

  /**
   * Delete a task
   * 
   * @param req - Express request containing task ID in params
   * @param res - Express response
   * @returns Promise<void>
   * 
   * HTTP 204 - Task deleted successfully
   * HTTP 404 - Task not found
   * HTTP 500 - Server error
   */
  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await this.taskService.deleteTask(id);
      
      if (!success) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error });
    }
  };

  /**
   * Mark a task as completed
   * 
   * @param req - Express request containing task ID in params
   * @param res - Express response
   * @returns Promise<void>
   * 
   * HTTP 200 - Task marked as completed
   * HTTP 404 - Task not found
   * HTTP 500 - Server error
   */
  completeTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const task = await this.taskService.completeTask(id);
      
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error completing task', error });
    }
  };

  /**
   * Assign a task to a user
   * 
   * @param req - Express request containing task ID in params and user ID in body
   * @param res - Express response
   * @returns Promise<void>
   * 
   * HTTP 200 - Task assigned successfully
   * HTTP 404 - Task not found
   * HTTP 500 - Server error
   */
  assignTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const userId = req.body.userId;
      const task = await this.taskService.assignTask(id, userId);
      
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error assigning task', error });
    }
  };
} 