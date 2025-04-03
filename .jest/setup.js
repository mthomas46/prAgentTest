// Mock modules that require node: protocol
jest.mock('node:path', () => require('path'));
jest.mock('node:os', () => require('os'));
jest.mock('node:events', () => require('events'));
jest.mock('node:fs', () => require('fs'));

// Mock database connection
jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    createConnection: jest.fn().mockResolvedValue({
      connect: jest.fn(),
      close: jest.fn(),
    }),
    getConnection: jest.fn().mockReturnValue({
      connect: jest.fn(),
      close: jest.fn(),
      manager: {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      },
    }),
  };
});

// Mock NestJS Logger
jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    Logger: jest.fn().mockImplementation(() => ({
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    })),
  };
}); 