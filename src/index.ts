/**
 * @fileoverview Main application entry point and Express server setup
 * @module index
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import { config, constants } from './utils/config.js';
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
import { execSync } from 'child_process';
import fs from 'fs';
import { dirname, join } from 'path';
import { marked } from 'marked';

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "data:", "https:"],
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

// Serve static files
app.use(express.static(join(__dirname, 'public')));
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
    
    if (!constants.ALLOWED_DOC_FILES.includes(file as typeof constants.ALLOWED_DOC_FILES[number])) {
        return res.status(404).json({ 
            error: 'Documentation file not found',
            message: `File "${file}" is not in the allowed list`
        });
    }
    
    // Set the content type to text/plain for markdown files
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(process.cwd(), file));
});

/**
 * Code metrics endpoint
 * @swagger
 * /api/metrics:
 *   get:
 *     summary: Get code metrics
 *     description: Returns various code metrics and statistics
 *     responses:
 *       200:
 *         description: Code metrics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLines:
 *                   type: number
 *                 codeLines:
 *                   type: number
 *                 commentLines:
 *                   type: number
 *                 blankLines:
 *                   type: number
 *                 fileTypes:
 *                   type: object
 *                 complexity:
 *                   type: object
 *                 typeCoverage:
 *                   type: object
 *                 codeSmells:
 *                   type: object
 *                 historicalTrends:
 *                   type: object
 */
app.get('/api/metrics', (req, res) => {
    try {
        // Get code statistics using cloc
        const clocOutput = execSync('npx cloc . --exclude-dir=node_modules,dist --json').toString();
        const clocData = JSON.parse(clocOutput);

        // Get total metrics from the SUM entry
        const totalMetrics = clocData.SUM || {
            code: 0,
            comment: 0,
            blank: 0
        };

        // Calculate metrics
        const totalLines = totalMetrics.code + totalMetrics.comment + totalMetrics.blank;
        const codeLines = totalMetrics.code;
        const commentLines = totalMetrics.comment;
        const blankLines = totalMetrics.blank;

        // Get file type distribution (excluding header and SUM)
        const fileTypes = Object.entries(clocData)
            .filter(([key]) => key !== 'header' && key !== 'SUM')
            .map(([lang, data]: [string, any]) => ({
                type: lang,
                count: data.nFiles,
                lines: data.code
            }));

        // Calculate complexity (placeholder - you might want to use a proper complexity analyzer)
        const complexity = {
            average: 2.5,
            max: 10,
            distribution: {
                low: 60,
                medium: 30,
                high: 10
            }
        };

        // Calculate type coverage (placeholder - you might want to use a proper type checker)
        const typeCoverage = {
            percentage: 85,
            totalTypes: 150,
            coveredTypes: 128
        };

        // Count code smells (placeholder - you might want to use a proper linter)
        const codeSmells = {
            total: 12,
            byType: {
                complexity: 5,
                duplication: 3,
                naming: 2,
                other: 2
            }
        };

        // Get historical trends (placeholder - you might want to use git history)
        const historicalTrends = {
            dates: ['2024-01-01', '2024-02-01', '2024-03-01', '2024-04-01'],
            metrics: {
                linesOfCode: [1000, 1500, 2000, 2500],
                complexity: [2.0, 2.2, 2.4, 2.5],
                typeCoverage: [80, 82, 84, 85]
            }
        };

        res.json({
            totalLines,
            codeLines,
            commentLines,
            blankLines,
            fileTypes,
            complexity,
            typeCoverage,
            codeSmells,
            historicalTrends
        });
    } catch (error) {
        console.error('Error generating metrics:', error);
        res.status(500).json({ error: 'Failed to generate code metrics' });
    }
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

/**
 * Global error handler middleware
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  const response: ErrorResponse = {
    error: 'Internal Server Error',
    path: req.path,
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  };
  res.status(500).json(response);
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    console.log(`⚡️[server]: Running at http://localhost:${config.PORT}`);
    console.log(`📝 API Docs: http://localhost:${config.PORT}/api-docs`);
  });
}

export default app; 