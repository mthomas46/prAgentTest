import express from 'express';
import cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import { config } from './utils/config.js';
import { swaggerSpec } from './swagger.js';

export const app = express();

// Middleware
app.use(cors({ origin: config.CORS_ORIGINS }));
app.use(express.json());

// Security headers
app.use((_, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

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
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns a welcome message
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello, World!
 */
app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to the API',
    docs: '/api-docs',
    version: '1.0.0'
  });
});

app.get('/api', (_, res) => {
  res.json({
    message: 'API is running',
    documentation: '/api-docs',
    version: '1.0.0'
  });
});

app.get('/api/health', (_, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API root endpoint
 *     description: Returns API information
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 documentation:
 *                   type: string
 *                 version:
 *                   type: string
 */

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    console.log(`⚡️[server]: Running at http://localhost:${config.PORT}`);
    console.log(`📝 API Docs: http://localhost:${config.PORT}/api-docs`);
  });
}

export default app; 