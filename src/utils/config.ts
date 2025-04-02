/**
 * @fileoverview Application configuration and environment variables
 * @module config
 */

import { z } from 'zod';
import type { Config } from './docs.js';

/**
 * Environment variables schema
 * @type {z.ZodSchema<Config>}
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(8090),
  CORS_ORIGINS: z.string().default('http://localhost:8090'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1).max(Number.MAX_SAFE_INTEGER).default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).max(Number.MAX_SAFE_INTEGER).default(100) // limit each IP to 100 requests per windowMs
});

/**
 * Application constants
 */
export const constants = {
  ALLOWED_DOC_FILES: ['README.md', 'CHANGELOG.md', 'dialogue.md', 'STATISTICS.md'] as const,
  DEFAULT_DOC_FILE: 'README.md' as const
} as const;

/**
 * Parse and validate environment variables
 * @returns {Config} Validated configuration object
 * @throws {Error} If environment variables are invalid
 */
export const config = envSchema.parse(process.env); 