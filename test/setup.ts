import { Logger } from '@nestjs/common';

// Disable logging during tests
Logger.overrideLogger(['error', 'warn']);

// Global test setup
beforeAll(async () => {
  // Add any global setup here
});

// Global test cleanup
afterAll(async () => {
  // Add any global cleanup here
}); 