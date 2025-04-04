import express, { Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import { ServiceConfig, HealthCheckHandler, ErrorHandler, ProxyRequestHandler } from './types';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

app.use(limiter);

// Service configuration
const services: ServiceConfig[] = [
  {
    name: 'bifrost',
    target: process.env.BIFROST_URL || 'http://bifrost:3000',
    path: '/bifrost'
  },
  {
    name: 'heimdal',
    target: process.env.HEIMDAL_URL || 'http://heimdal:3000',
    path: '/heimdal'
  }
];

// Health check endpoint
const healthCheck: HealthCheckHandler = (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: services.map(s => s.name)
  });
};

app.get('/health', healthCheck);

// Error handler
const errorHandler: ErrorHandler = (err: Error, req: IncomingMessage, res: ServerResponse | Socket) => {
  console.error(`Error proxying request:`, err);
  if (res instanceof ServerResponse) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Service unavailable',
      timestamp: new Date().toISOString()
    }));
  }
};

// Proxy request handler
const proxyRequestHandler: ProxyRequestHandler = (proxyReq, req, res) => {
  proxyReq.setHeader('X-Forwarded-For', req.ip);
  proxyReq.setHeader('X-Forwarded-Host', req.hostname);
  proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
};

// Load balancing configuration
services.forEach(service => {
  const proxyOptions: Options = {
    target: service.target,
    changeOrigin: true,
    pathRewrite: {
      [`^${service.path}`]: ''
    },
    onError: errorHandler,
    onProxyReq: proxyRequestHandler,
    logLevel: 'debug',
    secure: false,
    timeout: 30000
  };

  app.use(
    service.path,
    createProxyMiddleware(proxyOptions)
  );
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Draupnir load balancer running on port ${PORT}`);
  console.log('Available services:');
  services.forEach(service => {
    console.log(`- ${service.name}: ${service.target}`);
  });
}); 