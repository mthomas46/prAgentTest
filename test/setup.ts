import 'reflect-metadata';
import { config } from 'dotenv';
import { REQUEST } from '@nestjs/core';

// Mock Logger from @nestjs/common
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  })),
}));

// Mock REQUEST token from @nestjs/core
jest.mock('@nestjs/core', () => ({
  ...jest.requireActual('@nestjs/core'),
  REQUEST: Symbol('REQUEST'),
}));

// Mock EventEmitter2 from @nestjs/event-emitter
jest.mock('@nestjs/event-emitter', () => ({
  ...jest.requireActual('@nestjs/event-emitter'),
  EventEmitter2: jest.fn().mockImplementation(() => ({
    emit: jest.fn(),
  })),
}));

// Load environment variables
config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/test';
process.env.ELASTICSEARCH_URL = 'http://localhost:9200';
process.env.REDIS_URL = 'redis://localhost:6379';

// Set test timeout
jest.setTimeout(30000);

// Mock console methods
const originalConsole = { ...console };
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  console.debug = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.debug = originalConsole.debug;
});

// Mock node:events module
jest.mock('node:events', () => {
  return {
    EventEmitter: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      emit: jest.fn(),
      removeListener: jest.fn(),
    })),
  };
});

// Mock winston-elasticsearch
jest.mock('winston-elasticsearch', () => {
  return {
    ElasticsearchTransport: jest.fn().mockImplementation(() => ({
      log: jest.fn(),
    })),
  };
});

// Global test setup
beforeAll(async () => {
  // Add any global setup here
});

// Global test cleanup
afterAll(async () => {
  // Add any global cleanup here
}); 