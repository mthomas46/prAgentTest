import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Increase timeout for all tests
jest.setTimeout(10000);

// Mock console.error to fail tests
const originalError = console.error;
console.error = (...args) => {
  originalError.call(console, ...args);
  throw new Error('Console error was called. Failing test...');
};

// Mock console.warn to fail tests
const originalWarn = console.warn;
console.warn = (...args) => {
  originalWarn.call(console, ...args);
  throw new Error('Console warn was called. Failing test...');
}; 