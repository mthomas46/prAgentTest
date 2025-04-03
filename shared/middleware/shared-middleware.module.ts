/**
 * Module that consolidates all shared middleware components.
 * This module provides common middleware functionality like request tracking,
 * security headers, compression, CORS, body parsing, etc.
 * 
 * @module SharedMiddlewareModule
 */
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SharedRequestIdMiddleware } from './shared-request-id.middleware';
import { SharedCorsMiddleware } from './shared-cors.middleware';
import { SharedRateLimitMiddleware } from './shared-rate-limit.middleware';
import { SharedCompressionMiddleware } from './shared-compression.middleware';
import { SharedHelmetMiddleware } from './shared-helmet.middleware';
import { SharedBodyParserMiddleware } from './shared-body-parser.middleware';
import { SharedCookieParserMiddleware } from './shared-cookie-parser.middleware';
import { SharedSessionMiddleware } from './shared-session.middleware';

/**
 * Middleware module that configures and applies all shared middleware components.
 * The middleware is applied in a specific order to ensure proper request processing:
 * 1. Request ID - Adds unique identifier to each request
 * 2. Helmet - Adds security headers
 * 3. Compression - Compresses responses
 * 4. CORS - Handles cross-origin requests
 * 5. Body Parser - Parses request bodies
 * 6. Cookie Parser - Parses cookies
 * 7. Session - Handles session management
 * 8. Rate Limit - Controls request rate
 * 
 * @example
 * ```typescript
 * @Module({
 *   imports: [SharedMiddlewareModule],
 *   // ... other module configuration
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class SharedMiddlewareModule {
  /**
   * Configures the middleware consumer to apply all shared middleware.
   * The middleware is applied globally to all routes.
   * 
   * @param consumer - The middleware consumer instance
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        SharedRequestIdMiddleware,
        SharedHelmetMiddleware,
        SharedCompressionMiddleware,
        SharedCorsMiddleware,
        SharedBodyParserMiddleware,
        SharedCookieParserMiddleware,
        SharedSessionMiddleware,
        SharedRateLimitMiddleware,
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
} 