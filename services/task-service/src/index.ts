import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createConnection, getRepository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import rateLimit from 'express-rate-limit';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

const execAsync = promisify(exec);
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Swagger configuration
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Task Service API',
    version: '1.0.0',
    description: 'API documentation for the Task service'
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Local development server'
    }
  ],
  paths: {
    '/tasks': {
      get: {
        summary: 'Get all tasks',
        responses: {
          '200': {
            description: 'List of tasks',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED'] },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/health': {
      get: {
        summary: 'Health check endpoint',
        responses: {
          '200': {
            description: 'Service health status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                    uptime: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/version': {
      get: {
        summary: 'Get service version',
        responses: {
          '200': {
            description: 'Service version information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    version: { type: 'string' },
                    service: { type: 'string' },
                    environment: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      // Docker internal hostnames
      'http://task-service:3000',
      'http://balder:3002',
      'http://webhook-service:3003',
      'http://heimdal:3004',
      // Localhost access
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-brokkr-token'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
app.use(express.json({ limit: '10kb' })); // Limit request body size

// Input validation middleware
const validateTaskInput = (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;
  
  if (req.method === 'POST' || req.method === 'PATCH') {
    if (title && (typeof title !== 'string' || title.length > 100)) {
      return res.status(400).json({ error: 'Title must be a string and less than 100 characters' });
    }
    if (description && (typeof description !== 'string' || description.length > 1000)) {
      return res.status(400).json({ error: 'Description must be a string and less than 1000 characters' });
    }
  }
  
  next();
};

// Database connection
createConnection({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_service',
  entities: [Task],
  synchronize: true,
  dropSchema: true,
}).then(() => {
  console.log('Database connection established');
}).catch((error: Error) => {
  console.error('Database connection error:', error);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Version endpoint
app.get('/version', (req: Request, res: Response) => {
  res.json({ 
    version: process.env.npm_package_version || '1.0.0',
    service: 'task-service',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test data endpoint (protected by Brokkr service token)
app.get('/test-data', (req: Request, res: Response) => {
  const brokkrToken = req.headers['x-brokkr-token'];
  
  if (brokkrToken !== process.env.BROKKR_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized: Only Brokkr service can access test data' });
  }

  /**
   * Returns a JSON-serialized version of test data for the Task entity.
   * This endpoint is useful for:
   * - Testing frontend components
   * - Documentation examples
   * - Integration testing
   * - Development and debugging
   */
  const testTasks = [
    {
      id: 1,
      title: "Test Task 1",
      description: "This is a test task in OPEN state",
      status: "OPEN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Test Task 2",
      description: "This is a test task in IN_PROGRESS state",
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Test Task 3",
      description: "This is a test task in COMPLETED state",
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      title: "Complex Test Task",
      description: "This is a test task with a longer description that includes special characters and formatting. It demonstrates how the task service handles various types of content.",
      status: "OPEN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  res.json(testTasks);
});

// Test database endpoints (protected by Brokkr service token)
app.post('/test-db/reset', async (req: Request, res: Response) => {
  const brokkrToken = req.headers['x-brokkr-token'];
  
  if (brokkrToken !== process.env.BROKKR_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized: Only Brokkr service can reset test database' });
  }

  try {
    const taskRepository = getRepository(Task);
    await taskRepository.clear();
    res.json({ message: 'Test database reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset test database' });
  }
});

app.post('/test-db/seed', async (req: Request, res: Response) => {
  const brokkrToken = req.headers['x-brokkr-token'];
  
  if (brokkrToken !== process.env.BROKKR_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized: Only Brokkr service can seed test database' });
  }

  try {
    const taskRepository = getRepository(Task);
    const testTasks = [
      taskRepository.create({
        title: "Test Task 1",
        description: "This is a test task in OPEN state",
        status: TaskStatus.OPEN
      }),
      taskRepository.create({
        title: "Test Task 2",
        description: "This is a test task in IN_PROGRESS state",
        status: TaskStatus.IN_PROGRESS
      }),
      taskRepository.create({
        title: "Test Task 3",
        description: "This is a test task in COMPLETED state",
        status: TaskStatus.COMPLETED
      })
    ];

    await taskRepository.save(testTasks);
    res.json({ message: 'Test database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed test database' });
  }
});

// Shutdown endpoint (protected by Loki service token)
app.post('/shutdown', (req: Request, res: Response) => {
  const lokiToken = req.headers['x-loki-token'];
  
  if (lokiToken === process.env.LOKI_SHUTDOWN_TOKEN) {
    res.json({ message: 'Shutting down service...' });
    process.exit(0);
  } else {
    res.status(403).json({ error: 'Unauthorized: Only Loki service can trigger shutdown' });
  }
});

// Routes
app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const taskRepository = getRepository(Task);
    const tasks = await taskRepository.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/tasks', validateTaskInput, async (req: Request, res: Response) => {
  try {
    const taskRepository = getRepository(Task);
    const task = taskRepository.create(req.body);
    const savedTask = await taskRepository.save(task);
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
});

app.get('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const taskRepository = getRepository(Task);
    const task = await taskRepository.findOneBy({ id: parseInt(req.params.id) });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

app.patch('/tasks/:id', validateTaskInput, async (req: Request, res: Response) => {
  try {
    const taskRepository = getRepository(Task);
    const task = await taskRepository.findOneBy({ id: parseInt(req.params.id) });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    Object.assign(task, req.body);
    const updatedTask = await taskRepository.save(task);
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const taskRepository = getRepository(Task);
    const task = await taskRepository.findOneBy({ id: parseInt(req.params.id) });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await taskRepository.remove(task);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.patch('/tasks/:id/complete', async (req: Request, res: Response) => {
  try {
    const taskRepository = getRepository(Task);
    const task = await taskRepository.findOneBy({ id: parseInt(req.params.id) });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.status = TaskStatus.COMPLETED;
    const updatedTask = await taskRepository.save(task);
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to complete task' });
  }
});

app.listen(port, () => {
  console.log(`Task service running on port ${port}`);
}); 