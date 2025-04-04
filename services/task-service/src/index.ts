import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
  res.json({ status: 'ok' });
});

// Routes
app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/tasks', async (req: Request, res: Response) => {
  try {
    const task = Task.create(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
});

app.get('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findOneBy({ id: parseInt(req.params.id) });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

app.patch('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findOneBy({ id: parseInt(req.params.id) });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    Object.assign(task, req.body);
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findOneBy({ id: parseInt(req.params.id) });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.patch('/tasks/:id/complete', async (req: Request, res: Response) => {
  try {
    const task = await Task.findOneBy({ id: parseInt(req.params.id) });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.status = TaskStatus.DONE;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to complete task' });
  }
});

app.listen(port, () => {
  console.log(`Task service running on port ${port}`);
}); 