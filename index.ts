import express from 'express';
import cors from 'cors';  // CORS module for handling cross-origin requests
import swaggerUi from 'swagger-ui-express';  // Swagger UI for documentation
import { json } from 'body-parser';  // Body-parser for handling JSON payloads
import { swaggerSpec } from './swagger';  // Swagger documentation setup

const app = express();
const PORT = 8080;  // Port where the server will listen

/**
 * CORS middleware to allow cross-origin requests for local testing.
 */
app.use(cors());

/**
 * Middleware to parse incoming JSON requests.
 */
app.use(json());

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Displays the Swagger API documentation
 *     description: Returns the API documentation in Swagger UI format.
 *     responses:
 *       200:
 *         description: A successful response with Swagger UI documentation.
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
 *     description: The main route that returns a "Hello, World!" message.
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
    res.send('Hello, World!');  // Sends "Hello, World!" as a response
});

/**
 * Starts the Express server and logs the server details.
 */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
