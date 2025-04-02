/**
 * @fileoverview Main application entry point and Express server setup
 * @module index
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import docsRouter from './routes/docs.js';
import projectDocsRouter from './routes/projectDocs.js';
import healthRouter from './routes/health.js';
import { swaggerSpec } from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8090;

// Middleware
app.use(express.json());

// Swagger UI setup
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Express TypeScript API Documentation"
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/docs', docsRouter);
app.use('/api/project-docs', projectDocsRouter);
app.use('/api/health', healthRouter);

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get API overview
 *     description: Returns an overview of the API, including available endpoints and version information
 *     tags: [Overview]
 *     responses:
 *       200:
 *         description: API overview information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [ok]
 *                 version:
 *                   type: string
 *                   description: API version
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     health:
 *                       type: string
 *                       description: Health check endpoint
 *                     docs:
 *                       type: string
 *                       description: Documentation endpoint
 *                     apiDocs:
 *                       type: string
 *                       description: API documentation endpoint
 *                     swagger:
 *                       type: string
 *                       description: Swagger UI endpoint
 *           text/html:
 *             description: HTML documentation page
 */
app.get('/api', (req: express.Request, res: express.Response): void => {
    // Check if client accepts HTML
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', 'api.html'));
    } else {
        // Default to JSON response
        res.json({
            status: 'ok',
            version: '1.0.0',
            endpoints: {
                health: '/api/health',
                docs: '/api/docs',
                apiDocs: '/api-docs',
                swagger: '/swagger'
            }
        });
    }
});

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Get API documentation page
 *     description: Returns the main API documentation page in HTML format
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: API documentation page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'api-docs.html'));
});

/**
 * @swagger
 * /api-docs.json:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI (Swagger) specification in JSON format
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.get('/api-docs.json', (_: express.Request, res: express.Response): void => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Error handling middleware
app.use((err: any, _: Request, res: Response, __: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, (): void => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`API documentation is available at http://localhost:${port}/api-docs`);
    console.log(`Swagger UI is available at http://localhost:${port}/swagger`);
});

export default app; 