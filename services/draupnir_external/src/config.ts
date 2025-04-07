/**
 * Load Balancer Configuration Module
 * 
 * This module defines the configuration interface and default values
 * for the external load balancer service.
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuration interface defining the structure of the load balancer settings
 */
interface Config {
  port: number;                    // Port number for the load balancer
  services: {
    bifrost: string;              // URL for the Bifrost service
    heimdal: string;              // URL for the Heimdal service
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
  port: parseInt(process.env.PORT || '3000', 10),
  services: {
    bifrost: process.env.BIFROST_URL || 'http://bifrost:3000',
    heimdal: process.env.HEIMDAL_URL || 'http://heimdal:3000'
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