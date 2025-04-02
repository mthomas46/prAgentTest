import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('API Server', () => {
    const apiPrefix = process.env.API_PREFIX || '/api';

    describe('Routes', () => {
        it('GET / - root endpoint', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);
            
            expect(response.body.message).toBe('Welcome to the API');
        });

        it('GET /api - API root endpoint', async () => {
            const response = await request(app)
                .get('/api')
                .expect(200);
            
            expect(response.body.message).toBe('API is running');
        });

        it('GET /api/health - health check', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'healthy',
                timestamp: expect.any(String)
            });
        });

        it('GET /non-existent - 404 handling', async () => {
            const response = await request(app)
                .get('/non-existent')
                .expect(404);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('Security Headers', () => {
        it('should have security headers', async () => {
            const response = await request(app).get('/');
            
            expect(response.headers).toMatchObject({
                'x-content-type-options': 'nosniff',
                'x-frame-options': 'DENY',
                'x-xss-protection': '1; mode=block'
            });
        });
    });
}); 