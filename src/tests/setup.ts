import { config } from 'dotenv';
import { resolve } from 'path';
import { app } from '../index';

// Load test environment variables
config({ path: resolve(__dirname, '../../.env.test') });

let server: any;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
}); 