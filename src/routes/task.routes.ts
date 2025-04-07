/**
 * Task Routes Module
 * 
 * This module defines the RESTful API endpoints for task management,
 * including CRUD operations and task-specific actions.
 */

import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

// Initialize router and controller
const router = Router();
const taskController = new TaskController();

/**
 * Task Management Routes
 * 
 * POST /api/tasks - Create a new task
 * GET /api/tasks - Retrieve all tasks
 * GET /api/tasks/:id - Retrieve a specific task by ID
 * PUT /api/tasks/:id - Update an existing task
 * DELETE /api/tasks/:id - Delete a task
 * PATCH /api/tasks/:id/complete - Mark a task as completed
 * PATCH /api/tasks/:id/assign - Assign a task to a user
 */

// Create a new task
router.post('/', taskController.createTask);

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get a task by ID
router.get('/:id', taskController.getTaskById);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// Mark a task as completed
router.patch('/:id/complete', taskController.completeTask);

// Assign a task to a user
router.patch('/:id/assign', taskController.assignTask);

export default router; 