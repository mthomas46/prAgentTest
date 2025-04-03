import { Logger } from '@nestjs/common';

// Disable logging during tests
Logger.overrideLogger(['error', 'warn']);

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