/**
 * Internal Load Balancer Configuration Module
 * 
 * This module defines the configuration interface and default values
 * for the internal load balancer service that manages core service communication.
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuration interface defining the structure of the internal load balancer settings
 */
interface Config {
  port: number;                    // Port number for the load balancer
  services: {
    gateway: string;              // URL for the gateway service
    core: string;                 // URL for core services
  };
  rateLimit: {
    windowMs: number;             // Time window for rate limiting
    max: number;                  // Maximum requests per window
    message: string;              // Rate limit exceeded message
  };
  proxy: {
    timeout: number;              // Proxy request timeout
    secure: boolean;              // Enable HTTPS
    logLevel: string;            // Proxy logging level
  };
}

/**
 * Default configuration with environment variable overrides
 * 
 * Service URLs default to Docker service names in development
 * Rate limiting is set to 100 requests per 15 minutes
 * Proxy settings are optimized for development
 */
const config: Config = {
  port: parseInt(process.env.PORT || '3004', 10),
  services: {
    gateway: process.env.GATEWAY_URL || 'http://task-service:3000',
    core: process.env.CORE_SERVICES_URL || 'http://localhost:3005'
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,    // 15 minutes in milliseconds
    max: 100,                     // Maximum requests per window
    message: 'Too many requests from this IP, please try again later'
  },
  proxy: {
    timeout: 30000,              // 30 second timeout
    secure: false,               // Disable HTTPS in development
    logLevel: 'debug'           // Detailed logging in development
  }
};

export default config; 