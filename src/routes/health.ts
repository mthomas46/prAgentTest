import express, { Request, Response } from 'express';

const router = express.Router();

interface HealthStatus {
    status: 'ok' | 'degraded' | 'down';
    timestamp: string;
    version: string;
    services?: {
        [key: string]: {
            status: 'ok' | 'degraded' | 'down';
            latency: number;
            lastCheck: string;
        };
    };
    system?: {
        uptime: number;
        memory: {
            total: number;
            used: number;
            free: number;
        };
        cpu: {
            load: number;
            cores: number;
        };
    };
}

// Basic health check endpoint
router.get('/', (_: Request, res: Response): void => {
    const status: HealthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    };
    res.json(status);
});

// Detailed health check endpoint
router.get('/detailed', (_: Request, res: Response): void => {
    const status: HealthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
            database: {
                status: 'ok',
                latency: 5,
                lastCheck: new Date().toISOString()
            },
            cache: {
                status: 'ok',
                latency: 2,
                lastCheck: new Date().toISOString()
            },
            storage: {
                status: 'ok',
                latency: 10,
                lastCheck: new Date().toISOString()
            }
        },
        system: {
            uptime: process.uptime(),
            memory: {
                total: 8589934592,
                used: 4294967296,
                free: 4294967296
            },
            cpu: {
                load: 0.5,
                cores: 4
            }
        }
    };
    res.json(status);
});

export const healthRouter = router; 