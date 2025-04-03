import '@jest/globals';

// Mock environment variables
process.env.GITHUB_TOKEN = 'test-token';
process.env.BOT_USERNAME = 'test-bot';

// Mock console methods to reduce noise during tests
global.console.log = jest.fn();
global.console.error = jest.fn();
global.console.warn = jest.fn();

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  jest.resetAllMocks();
}); 