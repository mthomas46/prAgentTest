import { config } from '../utils/config.js';
import app from '../index.js';
import supertest from 'supertest';
import type { Server } from 'http';

export const request = supertest(app);
export const testConfig = config;

let server: Server;

beforeAll(() => {
    server = app.listen(0);
});

afterAll((done) => {
    server.close(done);
}); 