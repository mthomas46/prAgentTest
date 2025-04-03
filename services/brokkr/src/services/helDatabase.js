const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
const dbConfig = require('../config/database');

class HelDatabase {
  constructor() {
    this.sequelize = new Sequelize(dbConfig);
    this.initialize();
  }

  async initialize() {
    try {
      await this.sequelize.authenticate();
      logger.info('Successfully connected to Hel database');
    } catch (error) {
      logger.error(`Unable to connect to Hel database: ${error.message}`);
      throw error;
    }
  }

  async getTableNames() {
    try {
      const [results] = await this.sequelize.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      return results.map(result => result.table_name);
    } catch (error) {
      logger.error(`Error fetching table names: ${error.message}`);
      throw error;
    }
  }

  async getTableData(tableName) {
    try {
      const [results] = await this.sequelize.query(`SELECT * FROM "${tableName}" LIMIT 100`);
      return results;
    } catch (error) {
      logger.error(`Error fetching data from table ${tableName}: ${error.message}`);
      throw error;
    }
  }

  async getTableSchema(tableName) {
    try {
      const [results] = await this.sequelize.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = '${tableName}'
      `);
      return results;
    } catch (error) {
      logger.error(`Error fetching schema for table ${tableName}: ${error.message}`);
      throw error;
    }
  }

  async executeQuery(query) {
    try {
      const [results] = await this.sequelize.query(query);
      return results;
    } catch (error) {
      logger.error(`Error executing query: ${error.message}`);
      throw error;
    }
  }

  async close() {
    try {
      await this.sequelize.close();
      logger.info('Successfully closed Hel database connection');
    } catch (error) {
      logger.error(`Error closing Hel database connection: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new HelDatabase(); 