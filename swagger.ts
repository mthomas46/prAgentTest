import * as swaggerJSDoc from 'swagger-jsdoc'; // Ensure this is a namespace import
import { Options } from 'swagger-jsdoc';

const options: Options = {
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
    apis: ['./index.ts'], // Ensure correct path
};

export const swaggerSpec = swaggerJSDoc.default(options);
