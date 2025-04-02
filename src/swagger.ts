import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './utils/config.js';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API',
      version: '1.0.0',
      description: 'Modern TypeScript API Documentation',
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/*.ts'],
}); 