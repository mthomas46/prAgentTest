import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { type Express } from 'express';
import { config } from '../utils/config.js';

export const configureSecurityMiddleware = (app: Express) => {
    // Enable compression
    app.use(compression());

    // Enhanced security headers with Swagger UI support
    app.use(helmet({
        frameguard: { action: 'deny' },
        contentSecurityPolicy: false,
        dnsPrefetchControl: true,
        hidePoweredBy: true,
        crossOriginEmbedderPolicy: false,
    }));

    // Rate limiting
    app.use(rateLimit({
        windowMs: config.RATE_LIMIT_WINDOW_MS,
        limit: config.RATE_LIMIT_MAX_REQUESTS,
        standardHeaders: true,
        legacyHeaders: false
    }));

    // Additional security headers
    app.use((_, res, next) => {
        res.setHeader('Permissions-Policy', 
            'geolocation=(), microphone=(), camera=(), payment=(), usb=()');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        next();
    });
}; 