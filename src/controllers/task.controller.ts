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
   * Get all tasks
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
   * Get a task by ID
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
   * Update a task
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
   */
  assignTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const { userId } = req.body;
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      
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