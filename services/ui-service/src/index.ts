import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = process.env.PORT || 4000;
const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://task-service:3000';

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
  res.json({ status: 'ok' });
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`UI Service running on port ${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
}); 