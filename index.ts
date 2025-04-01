import express from 'express';
import cors from 'cors';  // CORS module for handling cross-origin requests
import swaggerUi from 'swagger-ui-express';  // Swagger UI for documentation
import { json } from 'body-parser';  // Body-parser for handling JSON payloads
import { swaggerSpec } from './swagger';  // Swagger documentation setup

const app = express();
const PORT = 8080;  // Port where the server will listen

/**
 * Middleware to handle CORS (Cross-Origin Resource Sharing).
 * This is useful for enabling cross-origin requests during local development and testing.
 */
app.use(cors());

/**
 * Middleware to parse incoming JSON requests.
 * This will allow the server to process JSON bodies in incoming requests.
 */
app.use(json());

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Displays the Swagger API documentation
 *     description: Serves the Swagger UI with the API documentation for the Hello World API.
 *     responses:
 *       200:
 *         description: A successful response with the Swagger UI documentation.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "Swagger UI page"
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a hello world message
 *     description: The main route that returns a simple "Hello, World!" message when accessed.
 *     responses:
 *       200:
 *         description: A successful response with the message "Hello, World!"
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello, World!
 */
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello, World!');  // Sends "Hello, World!" as a response to the client
});

/**
 * Starts the Express server on port 8080 and logs the server details to the console.
 * This function will output a message indicating the server is running and available.
 */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
