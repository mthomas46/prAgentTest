// Import necessary modules for Swagger
import * as swaggerJSDoc from 'swagger-jsdoc';  // Swagger JSDoc for generating docs
import { Options } from 'swagger-jsdoc';  // Swagger Options type

/**
 * Defines the Swagger options for generating API documentation.
 */
const options: Options = {
    definition: {
        openapi: '3.0.0',  // OpenAPI version
        info: {
            title: 'Hello World API',  // Title of the API
            version: '1.0.0',  // API version
            description: 'A simple Express API with Swagger documentation',  // Description of the API
        },
        servers: [
            {
                url: 'http://localhost:8080',  // Server URL
                description: 'Local server',  // Server description
            },
        ],
    },
    apis: ['./index.ts'],  // Path to files with Swagger annotations (in this case, 'index.ts')
};

/**
 * Generates the Swagger specification based on the defined options.
 * This will be used by swagger-ui-express to serve the documentation.
 */
export const swaggerSpec = swaggerJSDoc.default(options);  // Using 'default' to access the function
