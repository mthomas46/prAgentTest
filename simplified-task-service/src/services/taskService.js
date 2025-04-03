const { Task, TaskStatus } = require('../models/Task');

class TaskService {
  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task
   */
  async createTask(taskData) {
    return await Task.create(taskData);
  }

  /**
   * Get all tasks
   * @returns {Promise<Array>} List of tasks
   */
  async getAllTasks() {
    return await Task.findAll({
      where: { deletedAt: null },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Get a task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Task
   */
  async getTaskById(id) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return task;
  }

  /**
   * Update a task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(id, taskData) {
    const task = await this.getTaskById(id);
    await task.update(taskData);
    return task;
  }

  /**
   * Delete a task (soft delete)
   * @param {number} id - Task ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteTask(id) {
    const task = await this.getTaskById(id);
    await task.destroy();
    return true;
  }

  /**
   * Mark a task as completed
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Updated task
   */
  async completeTask(id) {
    return await this.updateTask(id, {
      completed: true,
      status: TaskStatus.COMPLETED
    });
  }

  /**
   * Assign a task to a user
   * @param {number} id - Task ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated task
   */
  async assignTask(id, userId) {
    return await this.updateTask(id, { assignedTo: userId });
  }

  /**
   * Get tasks by status
   * @param {number} status - Task status
   * @returns {Promise<Array>} List of tasks
   */
  async getTasksByStatus(status) {
    return await Task.findAll({
      where: { 
        status,
        deletedAt: null
      },
      order: [['createdAt', 'DESC']]
    });
  }
}

module.exports = new TaskService(); 