import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.number().default(8090),
  CORS_ORIGINS: z.string().default('*'),
});

export const config = configSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT),
  CORS_ORIGINS: process.env.CORS_ORIGINS,
}); 