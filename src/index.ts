/**
 * Task Service Main Application Module
 * 
 * This module sets up the Express application, configures middleware,
 * defines routes, and handles server startup with database initialization.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import taskRoutes from './routes/task.routes';
import logger from './utils/logger';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware Configuration
 * 
 * - helmet: Adds security headers
 * - cors: Enables Cross-Origin Resource Sharing
 * - express.json: Parses JSON request bodies
 * - morgan: Logs HTTP requests in development format
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mount task routes under /api/tasks prefix
app.use('/api/tasks', taskRoutes);

/**
 * Health Check Endpoint
 * 
 * Used by load balancers and monitoring systems to verify service availability
 */
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

/**
 * Global Error Handler
 * 
 * Catches any unhandled errors in the application
 * Logs the error and returns a 500 response
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

/**
 * Server Startup Function
 * 
 * Initializes the database connection and starts the Express server
 * Exits the process if initialization fails
 */
const startServer = async () => {
  try {
    // Initialize database connection and sync models
    await initDatabase();
    
    // Start the HTTP server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer(); 