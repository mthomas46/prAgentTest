import express from 'express';
import cors from 'cors';
import { version } from '../package.json';

const app = express();
const port = 3006;

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
        name: 'Brokkr Service',
        description: 'Document processing and workflow automation'
    });
});

// ... existing code ...

app.listen(port, () => {
    console.log(`Brokkr Service running on port ${port}`);
}); 