const axios = require('axios');
const logger = require('../utils/logger');

class ExternalService {
  constructor() {
    this.bifrostUrl = process.env.BIFROST_URL || 'http://localhost:3001';
    this.taskServiceUrl = process.env.TASK_SERVICE_URL || 'http://localhost:3000';
    this.uiServiceUrl = process.env.UI_SERVICE_URL || 'http://localhost:3002';
  }

  async getBifrostData() {
    try {
      logger.info('Fetching data from Bifrost service');
      const response = await axios.get(`${this.bifrostUrl}/health`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching data from Bifrost: ${error.message}`);
      throw error;
    }
  }

  async getTaskServiceData() {
    try {
      logger.info('Fetching data from Task Service');
      const response = await axios.get(`${this.taskServiceUrl}/tasks`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching data from Task Service: ${error.message}`);
      throw error;
    }
  }

  async getUiServiceData() {
    try {
      logger.info('Fetching data from UI Service');
      const response = await axios.get(`${this.uiServiceUrl}/health`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching data from UI Service: ${error.message}`);
      throw error;
    }
  }

  async getAllServicesData() {
    try {
      logger.info('Fetching data from all services');
      const [bifrostData, taskData, uiData] = await Promise.all([
        this.getBifrostData().catch(() => ({ error: 'Failed to fetch Bifrost data' })),
        this.getTaskServiceData().catch(() => ({ error: 'Failed to fetch Task Service data' })),
        this.getUiServiceData().catch(() => ({ error: 'Failed to fetch UI Service data' }))
      ]);

      return {
        bifrost: bifrostData,
        taskService: taskData,
        uiService: uiData
      };
    } catch (error) {
      logger.error(`Error fetching data from all services: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ExternalService(); 