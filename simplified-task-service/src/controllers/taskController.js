const taskService = require('../services/taskService');
const { TaskStatus } = require('../models/Task');

/**
 * Create a new task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createTask(req, res) {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Get all tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getAllTasks(req, res) {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get a task by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getTaskById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const task = await taskService.getTaskById(id);
    res.status(200).json(task);
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * Update a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateTask(req, res) {
  try {
    const id = parseInt(req.params.id);
    const task = await taskService.updateTask(id, req.body);
    res.status(200).json(task);
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * Delete a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteTask(req, res) {
  try {
    const id = parseInt(req.params.id);
    await taskService.deleteTask(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * Mark a task as completed
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function completeTask(req, res) {
  try {
    const id = parseInt(req.params.id);
    const task = await taskService.completeTask(id);
    res.status(200).json(task);
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * Assign a task to a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function assignTask(req, res) {
  try {
    const id = parseInt(req.params.id);
    const userId = req.params.userId;
    const task = await taskService.assignTask(id, userId);
    res.status(200).json(task);
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * Get tasks by status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getTasksByStatus(req, res) {
  try {
    const status = parseInt(req.params.status);
    
    // Validate status
    if (isNaN(status) || !Object.values(TaskStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const tasks = await taskService.getTasksByStatus(status);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  assignTask,
  getTasksByStatus
}; 