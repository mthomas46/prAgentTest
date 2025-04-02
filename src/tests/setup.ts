import { config } from 'dotenv';
import { app } from '../index.js';
import type { Server } from 'http';

// Load test environment variables
config();

let server: Server;

// @ts-ignore - These are provided by the test environment
beforeAll(() => {
  server = app.listen(0);
});

// @ts-ignore - These are provided by the test environment
afterAll((done: () => void) => {
  server.close(done);
}); 