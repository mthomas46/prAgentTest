/**
 * @fileoverview Documentation utilities and types for the API
 */

/**
 * Generic API response type
 * @template T - The type of data in the response
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  /** The response data */
  data: T;
  /** Optional message */
  message?: string;
  /** Optional error message */
  error?: string;
}

/**
 * Health check response type
 */
export interface HealthCheckResponse {
  /** Current health status */
  status: string;
  /** ISO timestamp of the check */
  timestamp: string;
}

/**
 * API information type
 */
export interface ApiInfo {
  /** API status message */
  message: string;
  /** URL to API documentation */
  docs: string;
  /** API version */
  version: string;
}

/**
 * API status type
 */
export interface ApiStatus {
  /** API status message */
  message: string;
  /** URL to API documentation */
  documentation: string;
  /** API version */
  version: string;
}

/**
 * Error response type
 */
export interface ErrorResponse {
  /** Error message */
  error: string;
  /** Requested path */
  path: string;
  /** Optional detailed error message */
  message?: string;
}

/**
 * Security headers type
 */
export interface SecurityHeaders {
  /** Content type options header */
  'x-content-type-options': string;
  /** Frame options header */
  'x-frame-options': string;
  /** XSS protection header */
  'x-xss-protection': string;
}

/**
 * Configuration type
 */
export interface Config {
  /** Current environment */
  NODE_ENV: string;
  /** Server port */
  PORT: number;
  /** Allowed CORS origins */
  CORS_ORIGINS: string;
}

/**
 * Swagger configuration type
 */
export interface SwaggerConfig {
  /** API title */
  title: string;
  /** API version */
  version: string;
  /** API description */
  description: string;
  /** API server URL */
  serverUrl: string;
}

/**
 * Test configuration type
 */
export interface TestConfig {
  /** Whether to use global test variables */
  globals: boolean;
  /** Test environment */
  environment: string;
  /** Test file patterns to include */
  include: string[];
} 