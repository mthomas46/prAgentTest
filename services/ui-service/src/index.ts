import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { exec } from 'child_process';
import axios from 'axios';
import cors from 'cors';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();
const port = process.env.PORT || 3002;
const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://task-service:3000';
const version = process.env.npm_package_version || '1.0.0';

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://task-service:3000',
    'http://balder:3002',
    'http://webhook-service:3003',
    'http://heimdal:3004'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-brokkr-token'],
  credentials: true
}));
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve Swagger UI
const swaggerOptions = {
  swaggerOptions: {
    urls: [
      {
        url: `${TASK_SERVICE_URL}/api-docs/swagger.json`,
        name: 'Task Service'
      }
    ]
  }
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

// API routes
app.get('/api/tasks', async (req, res) => {
  try {
    const response = await fetch(`${TASK_SERVICE_URL}/tasks`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const response = await fetch(`${TASK_SERVICE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const response = await fetch(`${TASK_SERVICE_URL}/tasks/${req.params.id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      res.status(204).send();
    } else {
      res.status(response.status).json({ error: 'Failed to delete task' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Health check endpoint
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
    version,
    service: 'ui-service',
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
   * Returns a JSON-serialized version of test data for the UI service.
   * This endpoint is useful for:
   * - Testing frontend components without backend dependencies
   * - Documentation examples
   * - Integration testing
   * - Development and debugging
   */
  const testData = {
    uiConfig: {
      theme: "light",
      language: "en",
      timezone: "UTC",
      dateFormat: "YYYY-MM-DD",
      timeFormat: "24h"
    },
    layout: {
      sidebar: {
        width: 250,
        position: "left",
        isCollapsible: true,
        defaultState: "expanded"
      },
      header: {
        height: 60,
        isSticky: true,
        showNotifications: true
      },
      mainContent: {
        maxWidth: 1200,
        padding: 20
      }
    },
    userPreferences: {
      notifications: {
        email: true,
        push: true,
        sound: false,
        desktop: true
      },
      accessibility: {
        highContrast: false,
        fontSize: "medium",
        reduceMotion: false
      },
      shortcuts: {
        saveTask: "Ctrl+S",
        newTask: "Ctrl+N",
        search: "Ctrl+F"
      }
    },
    mockTasks: [
      {
        id: 1,
        title: "Sample Task 1",
        description: "This is a sample task for UI testing",
        status: "OPEN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Sample Task 2",
        description: "Another sample task for UI testing",
        status: "IN_PROGRESS",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
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
    // Reset UI service test data
    res.json({ message: 'UI service test database reset successfully' });
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
    // Seed UI service test data
    res.json({ message: 'UI service test database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed test database' });
  }
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

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`UI Service running on port ${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
}); 