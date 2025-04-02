import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface HealthStatus {
    status: 'ok' | 'error';
    timestamp: string;
    uptime: number;
    memory?: {
        heapUsed: number;
        heapTotal: number;
        external: number;
    };
}

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Get API health status
 *     description: Returns the current health status of the API, including uptime and memory usage
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [ok, error]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 memory:
 *                   type: object
 *                   properties:
 *                     heapUsed:
 *                       type: number
 *                       description: Currently used heap memory in bytes
 *                     heapTotal:
 *                       type: number
 *                       description: Total heap memory in bytes
 *                     external:
 *                       type: number
 *                       description: External memory usage in bytes
 *           text/html:
 *             description: HTML documentation page
 *       503:
 *         description: API is experiencing issues
 */
router.get('/', (req: express.Request, res: express.Response): void => {
    // Check if client accepts HTML
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'public', 'health.html'));
    } else {
        // Default to JSON response
        const status: HealthStatus = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                heapUsed: process.memoryUsage().heapUsed,
                heapTotal: process.memoryUsage().heapTotal,
                external: process.memoryUsage().external
            }
        };
        res.json(status);
    }
});

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     summary: Get detailed health status
 *     description: Returns detailed health information including memory usage statistics
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [ok, error]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 memory:
 *                   type: object
 *                   properties:
 *                     heapUsed:
 *                       type: number
 *                       description: Currently used heap memory in bytes
 *                     heapTotal:
 *                       type: number
 *                       description: Total heap memory in bytes
 *                     external:
 *                       type: number
 *                       description: External memory usage in bytes
 */
router.get('/detailed', (_: express.Request, res: express.Response): void => {
    const status: HealthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
            heapUsed: process.memoryUsage().heapUsed,
            heapTotal: process.memoryUsage().heapTotal,
            external: process.memoryUsage().external
        }
    };
    res.json(status);
});

export default router; 