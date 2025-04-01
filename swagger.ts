import { SwaggerOptions } from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options: SwaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World API',
            version: '1.0.0',
            description: 'A simple Express API with Swagger documentation',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Local server',
            },
        ],
    },
    apis: ['index.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
