/**
 * Logger Utility Module
 * 
 * This module configures a Winston logger instance for application-wide logging,
 * supporting both console and file-based logging with different log levels.
 */

import winston from 'winston';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set default log level from environment or use 'info'
const { LOG_LEVEL = 'info' } = process.env;

/**
 * Winston logger instance with the following configuration:
 * - Log level controlled by environment variable
 * - JSON format for file logs
 * - Colorized console output
 * - Separate error and combined log files
 */
const logger = winston.createLogger({
  level: LOG_LEVEL,  // Minimum log level to record
  format: winston.format.combine(
    winston.format.timestamp(),  // Add timestamp to each log entry
    winston.format.json()        // Format logs as JSON
  ),
  transports: [
    // Console transport with colorized output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),  // Colorize log levels
        winston.format.simple()     // Simple format for console readability
      ),
    }),
    // Error log file (only error level and above)
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Combined log file (all levels)
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

export default logger; 