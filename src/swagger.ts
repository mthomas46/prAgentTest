/**
 * @fileoverview Swagger/OpenAPI documentation configuration
 * @module swagger
 */

import { config } from './utils/config.js';
import type { SwaggerConfig } from './utils/docs.js';

/**
 * Swagger configuration object
 * @type {SwaggerConfig}
 */
const swaggerConfig: SwaggerConfig = {
  title: 'Express TypeScript API',
  version: '1.0.0',
  description: 'A modern Express.js API built with TypeScript',
  serverUrl: `http://localhost:${config.PORT}`
};

/**
 * OpenAPI specification
 * @type {object}
 */
export const swaggerSpec = {
  openapi: '3.0.0',
  info: swaggerConfig,
  servers: [
    {
      url: swaggerConfig.serverUrl,
      description: 'Development server'
    }
  ],
  paths: {
    '/': {
      get: {
        summary: 'Root endpoint',
        description: 'Returns a welcome message and API information',
        responses: {
          '200': {
            description: 'Welcome message',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Welcome to the API'
                    },
                    docs: {
                      type: 'string',
                      example: '/api-docs'
                    },
                    version: {
                      type: 'string',
                      example: '1.0.0'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api': {
      get: {
        summary: 'API root endpoint',
        description: 'Returns API status and information',
        responses: {
          '200': {
            description: 'API information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'API is running'
                    },
                    documentation: {
                      type: 'string',
                      example: '/api-docs'
                    },
                    version: {
                      type: 'string',
                      example: '1.0.0'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/health': {
      get: {
        summary: 'Health check endpoint',
        description: 'Returns the current health status of the API',
        responses: {
          '200': {
            description: 'Health status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'healthy'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time'
                    }
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