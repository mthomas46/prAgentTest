import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './logger';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'draupnir_internal',
    timestamp: new Date().toISOString()
  });
});

// Gateway proxy
const gatewayProxy = createProxyMiddleware({
  target: process.env.GATEWAY_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/gateway': ''
  },
  logLevel: 'debug',
  onError: (err, req, res) => {
    logger.error('Gateway proxy error:', err);
    res.status(500).json({ error: 'Gateway service error' });
  }
});

// Core services proxy
const coreServicesProxy = createProxyMiddleware({
  target: process.env.CORE_SERVICES_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/core': ''
  },
  logLevel: 'debug',
  onError: (err, req, res) => {
    logger.error('Core services proxy error:', err);
    res.status(500).json({ error: 'Core services error' });
  }
});

// Routes
app.use('/gateway', gatewayProxy);
app.use('/core', coreServicesProxy);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Draupnir Internal load balancer running on port ${port}`);
  logger.info('Available services:');
  logger.info(`- Gateway: ${process.env.GATEWAY_URL}`);
  logger.info(`- Core Services: ${process.env.CORE_SERVICES_URL}`);
}); 