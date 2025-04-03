// Mock environment variables
process.env.PORT = '3000';
process.env.GITHUB_TOKEN = 'test-token';
process.env.GITHUB_APP_ID = 'test-app-id';
process.env.GITHUB_APP_PRIVATE_KEY = 'test-private-key';
process.env.GITHUB_APP_WEBHOOK_SECRET = 'test-webhook-secret';
process.env.OPENAI_API_KEY = 'test-api-key';

// Mock console methods to keep test output clean
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();
console.info = jest.fn(); 