/**
 * Database Configuration Module
 * 
 * This module handles the database connection setup using Sequelize ORM.
 * It provides a configured Sequelize instance and initialization function.
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration with default values for development
const {
  DB_HOST = 'postgres',      // Database host (default to Docker service name)
  DB_PORT = '5432',         // Database port
  DB_USERNAME = 'postgres', // Database username
  DB_PASSWORD = 'postgres', // Database password
  DB_NAME = 'task_service', // Database name
} = process.env;

/**
 * Sequelize instance configured with PostgreSQL
 * 
 * Configuration includes:
 * - Connection details from environment variables
 * - Development logging in development mode
 * - Timestamps and underscored naming convention
 */
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,    // Automatically add createdAt and updatedAt fields
    underscored: true,   // Use snake_case for column names
  },
});

/**
 * Initialize the database connection and sync models
 * 
 * This function:
 * 1. Tests the database connection
 * 2. Synchronizes all models with the database schema
 * 3. Exits the process if connection fails
 * 
 * @throws {Error} If database connection or sync fails
 */
export const initDatabase = async (): Promise<void> => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database models with schema
    // In development, this will alter tables to match models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}; 