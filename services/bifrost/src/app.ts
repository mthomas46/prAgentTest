import express from 'express';
import cors from 'cors';
import { version } from '../package.json';

const app = express();
const port = 3005;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Version endpoint
app.get('/version', (req, res) => {
    res.json({
        version: version,
        name: 'Bifrost Service',
        description: 'Integration and data transformation service'
    });
});

// ... existing code ...

app.listen(port, () => {
    console.log(`Bifrost Service running on port ${port}`);
}); 