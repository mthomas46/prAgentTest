import express, { Request, Response } from 'express';
import cors from 'cors';
import { services, Service } from './Navigation';

const app = express();
const port = process.env.PORT || 3002;

// Configure CORS to allow all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health endpoint
app.get('/health', (req: Request, res: Response) => {
    const startTime = process.uptime();
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: startTime,
        services: services.map(service => ({
            name: service.name,
            status: service.status,
            url: service.url
        }))
    });
});

// ... existing code ... 