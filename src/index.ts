/**
 * @fileoverview Main application entry point and Express server setup
 * @module index
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import { config } from './utils/config.js';
import { swaggerSpec } from './swagger.js';
import type { 
  ApiInfo, 
  ApiStatus, 
  HealthCheckResponse, 
  ErrorResponse, 
  SecurityHeaders 
} from './utils/docs.js';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';

/**
 * Express application instance
 * @type {express.Application}
 */
export const app = express();

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));
app.use(cors({
    origin: config.CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

/**
 * Security headers middleware
 * Adds essential security headers to all responses
 * @type {express.RequestHandler}
 */
app.use((_: Request, res: Response, next: NextFunction) => {
  const headers: SecurityHeaders = {
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'x-xss-protection': '1; mode=block'
  };
  
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  next();
});

// Serve static files
app.use(express.static(path.join(process.cwd(), 'src', 'public')));
app.use(express.static(process.cwd()));

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: API Documentation
 *     description: Swagger UI API documentation
 *     responses:
 *       200:
 *         description: HTML documentation page
 */
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));

/**
 * Root endpoint
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns the API welcome page
 *     responses:
 *       200:
 *         description: HTML welcome page
 */
app.get('/', (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * API root endpoint
 * @swagger
 * /api:
 *   get:
 *     summary: API root endpoint
 *     description: Returns API status and information
 *     responses:
 *       200:
 *         description: HTML status page
 */
app.get('/api', (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'api.html'));
});

/**
 * Health check endpoint
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current health status of the API
 *     responses:
 *       200:
 *         description: HTML health status page
 */
app.get('/api/health', (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'health.html'));
});

/**
 * Serve documentation files
 * @swagger
 * /docs/{file}:
 *   get:
 *     summary: Serve documentation files
 *     description: Returns the requested documentation file
 *     parameters:
 *       - name: file
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documentation file
 *       404:
 *         description: Documentation file not found
 */
app.get('/docs/:file', (req: Request, res: Response) => {
    const file = req.params.file;
    const allowedFiles = ['README.md', 'CHANGELOG.md', 'dialogue.md'];
    
    if (!allowedFiles.includes(file)) {
        return res.status(404).json({ error: 'Documentation file not found' });
    }
    
    // Set the content type to text/plain for markdown files
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(process.cwd(), file));
});

/**
 * 404 handler middleware
 * @swagger
 * /{path}:
 *   get:
 *     summary: 404 handler
 *     description: Handles requests to non-existent routes
 *     responses:
 *       404:
 *         description: Route not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Route not found
 *                 path:
 *                   type: string
 *                   example: /non-existent
 */
app.use((req: Request, res: Response) => {
  const response: ErrorResponse = {
    error: 'Route not found',
    path: req.path
  };
  res.status(404).json(response);
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    console.log(`⚡️[server]: Running at http://localhost:${config.PORT}`);
    console.log(`📝 API Docs: http://localhost:${config.PORT}/api-docs`);
  });
}

export default app; 