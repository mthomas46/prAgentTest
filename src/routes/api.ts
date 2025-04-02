import { Router } from 'express';

export const apiRouter = Router();

// Example route
apiRouter.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0'
  });
}); 