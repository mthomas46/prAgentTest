import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../utils/config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript API',
      version: '1.0.0',
      description: 'Modern TypeScript API with comprehensive documentation and health monitoring',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Documentation', description: 'API documentation endpoints' },
      { name: 'Project Documentation', description: 'Project documentation endpoints' },
      { name: 'Overview', description: 'API overview and information endpoints' }
    ],
    components: {
      securitySchemes: {
        rateLimit: {
          type: 'apiKey',
          in: 'header',
          name: 'X-RateLimit-Remaining',
          description: 'Rate limit remaining requests'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type'
            },
            message: {
              type: 'string',
              description: 'Human-readable error message'
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code'
            },
            details: {
              type: 'object',
              description: 'Optional additional error details'
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['ok', 'error'],
              description: 'Health status'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Current timestamp'
            },
            uptime: {
              type: 'integer',
              description: 'Server uptime in seconds'
            },
            memoryUsage: {
              type: 'object',
              properties: {
                heapUsed: {
                  type: 'integer',
                  description: 'Used heap memory in bytes'
                },
                heapTotal: {
                  type: 'integer',
                  description: 'Total heap memory in bytes'
                },
                external: {
                  type: 'integer',
                  description: 'External memory usage in bytes'
                },
                rss: {
                  type: 'integer',
                  description: 'Resident Set Size in bytes'
                }
              }
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              description: 'The actual response data'
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Response timestamp'
                },
                requestId: {
                  type: 'string',
                  description: 'Unique request identifier'
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        rateLimit: []
      }
    ]
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../index.ts')
  ],
};

export const swaggerSpec = swaggerJsdoc(options); 