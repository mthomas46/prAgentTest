import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initDatabase } from './config/database';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'sigrun',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Version endpoint
app.get('/version', (req, res) => {
  res.json({ 
    version: process.env.npm_package_version || '1.0.0',
    service: 'sigrun',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform
  });
});

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Sigrun authentication service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  }); 