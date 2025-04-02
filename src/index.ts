/**
 * @fileoverview Main application entry point and Express server setup
 * @module index
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { docsRouter } from './routes/docs.js';
import { healthRouter } from './routes/health.js';

const app = express();
const port = process.env.PORT || 8090;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/api', (_: Request, res: Response): void => {
    res.json({
        status: 'ok',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            docs: '/api/docs',
            apiDocs: '/api-docs'
        }
    });
});

app.use('/api/docs', docsRouter);
app.use('/api/health', healthRouter);

// API Documentation route
app.get('/api-docs', (_: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`API documentation is available at http://localhost:${port}/api-docs`);
});

export default app; 