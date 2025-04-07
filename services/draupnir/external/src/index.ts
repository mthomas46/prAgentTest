import express from 'express';
import { Config } from './config';

const app = express();

// Initialize metrics tracking
app.locals.activeConnections = 0;
app.locals.totalRequests = 0;
app.locals.lastRequestTimestamp = null;

// Load configuration
const config: Config = {
  port: parseInt(process.env.PORT || '3003', 10),
  services: {
    bifrost: process.env.BIFROST_URL || 'http://localhost:3005',
    heimdal: process.env.HEIMDAL_URL || 'http://localhost:3003'
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    message: 'Too many requests, please try again later'
  },
  proxy: {
    timeout: parseInt(process.env.PROXY_TIMEOUT || '30000', 10),
    secure: process.env.PROXY_SECURE === 'true',
    logLevel: process.env.PROXY_LOG_LEVEL || 'error'
  }
};

// Middleware to track metrics
app.use((req, res, next) => {
  app.locals.activeConnections++;
  app.locals.totalRequests++;
  app.locals.lastRequestTimestamp = new Date().toISOString();
  
  res.on('finish', () => {
    app.locals.activeConnections--;
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'draupnir-external',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    metrics: {
      activeConnections: req.app.locals.activeConnections || 0,
      totalRequests: req.app.locals.totalRequests || 0,
      lastRequestTimestamp: req.app.locals.lastRequestTimestamp || null
    }
  });
});

// Version endpoint
app.get('/version', (req, res) => {
  res.json({ 
    version: process.env.npm_package_version || '1.0.0',
    service: 'draupnir-external',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    configuration: {
      port: config.port,
      maxConnections: config.rateLimit.max,
      timeout: `${config.proxy.timeout}ms`
    }
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Draupnir External load balancer running on port ${config.port}`);
}); 