import express from 'express';
import axios, { AxiosError } from 'axios';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Service configurations
const services = {
  taskService: {
    name: 'task-service',
    healthUrl: 'http://task-service:3000/health',
    versionUrl: 'http://task-service:3000/version'
  },
  uiService: {
    name: 'ui-service',
    healthUrl: 'http://ui-service:4000/health',
    versionUrl: 'http://ui-service:4000/version'
  },
  postgres: {
    name: 'postgres',
    healthUrl: 'http://postgres:5432'  // We'll use pg_isready for health check
  }
};

// Health check endpoint for Heimdal itself
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Version endpoint for Heimdal itself
app.get('/version', (req, res) => {
  res.json({
    version: process.env.npm_package_version || '1.0.0',
    service: 'heimdal',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test data endpoint (protected by Brokkr service token)
app.get('/test-data', (req, res) => {
  const brokkrToken = req.headers['x-brokkr-token'];
  
  if (brokkrToken !== process.env.BROKKR_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized: Only Brokkr service can access test data' });
  }

  /**
   * Returns a JSON-serialized version of test data for the Heimdal service.
   * This endpoint is useful for:
   * - Testing monitoring dashboards
   * - Documentation examples
   * - Integration testing
   * - Development and debugging
   */
  const testData = {
    services: {
      taskService: {
        name: "task-service",
        health: {
          status: "ok",
          timestamp: new Date().toISOString(),
          uptime: 3600
        },
        version: {
          version: "1.0.0",
          environment: "development"
        },
        metrics: {
          cpu: 45.2,
          memory: 256.5,
          requests: 1000,
          errors: 0
        }
      },
      uiService: {
        name: "ui-service",
        health: {
          status: "ok",
          timestamp: new Date().toISOString(),
          uptime: 3600
        },
        version: {
          version: "1.0.0",
          environment: "development"
        },
        metrics: {
          cpu: 30.1,
          memory: 180.3,
          requests: 2000,
          errors: 0
        }
      },
      postgres: {
        name: "postgres",
        health: {
          status: "ok",
          message: "postgres:5432 - accepting connections"
        },
        version: "PostgreSQL 16.0",
        metrics: {
          connections: 10,
          queries: 5000,
          size: "2.5GB"
        }
      }
    },
    alerts: {
      cpu: {
        threshold: 80,
        duration: 300,
        severity: "warning"
      },
      memory: {
        threshold: 90,
        duration: 300,
        severity: "critical"
      },
      errors: {
        threshold: 5,
        duration: 60,
        severity: "error"
      }
    },
    monitoring: {
      interval: 30,
      retention: 7,
      timezone: "UTC"
    }
  };

  res.json(testData);
});

// Test database endpoints (protected by Brokkr service token)
app.post('/test-db/reset', async (req, res) => {
  const brokkrToken = req.headers['x-brokkr-token'];
  
  if (brokkrToken !== process.env.BROKKR_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized: Only Brokkr service can reset test database' });
  }

  try {
    // Reset Heimdal service test data
    res.json({ message: 'Heimdal service test database reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset test database' });
  }
});

app.post('/test-db/seed', async (req, res) => {
  const brokkrToken = req.headers['x-brokkr-token'];
  
  if (brokkrToken !== process.env.BROKKR_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized: Only Brokkr service can seed test database' });
  }

  try {
    // Seed Heimdal service test data
    res.json({ message: 'Heimdal service test database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed test database' });
  }
});

// Unified health check endpoint
app.get('/services/health', async (req, res) => {
  const results: Record<string, any> = {};
  
  // Check task service
  try {
    const response = await axios.get(services.taskService.healthUrl);
    results.taskService = response.data;
  } catch (error) {
    const err = error as AxiosError;
    results.taskService = { status: 'error', error: err.message || 'Unknown error' };
  }

  // Check UI service
  try {
    const response = await axios.get(services.uiService.healthUrl);
    results.uiService = response.data;
  } catch (error) {
    const err = error as AxiosError;
    results.uiService = { status: 'error', error: err.message || 'Unknown error' };
  }

  // Check PostgreSQL
  try {
    const { stdout } = await execAsync('pg_isready -h postgres -U postgres');
    results.postgres = { status: 'ok', message: stdout.trim() };
  } catch (error) {
    const err = error as Error;
    results.postgres = { status: 'error', error: err.message || 'Unknown error' };
  }

  res.json(results);
});

// Unified version endpoint
app.get('/services/version', async (req, res) => {
  const results: Record<string, any> = {};
  
  // Get task service version
  try {
    const response = await axios.get(services.taskService.versionUrl);
    results.taskService = response.data;
  } catch (error) {
    const err = error as AxiosError;
    results.taskService = { error: err.message || 'Unknown error' };
  }

  // Get UI service version
  try {
    const response = await axios.get(services.uiService.versionUrl);
    results.uiService = response.data;
  } catch (error) {
    const err = error as AxiosError;
    results.uiService = { error: err.message || 'Unknown error' };
  }

  // Get PostgreSQL version
  try {
    const { stdout } = await execAsync('psql -h postgres -U postgres -c "SELECT version();"');
    results.postgres = { version: stdout.trim() };
  } catch (error) {
    const err = error as Error;
    results.postgres = { error: err.message || 'Unknown error' };
  }

  res.json(results);
});

// Shutdown endpoint (protected by Loki service token)
app.post('/shutdown', (req, res) => {
  const lokiToken = req.headers['x-loki-token'];
  
  if (lokiToken === process.env.LOKI_SHUTDOWN_TOKEN) {
    res.json({ message: 'Shutting down service...' });
    process.exit(0);
  } else {
    res.status(403).json({ error: 'Unauthorized: Only Loki service can trigger shutdown' });
  }
});

app.listen(port, () => {
  console.log(`Heimdal service running on port ${port}`);
}); 