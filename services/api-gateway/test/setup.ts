import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Mock database configuration
const mockDbConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'api_test',
  entities: ['./**/*.entity.ts'],
  synchronize: true,
};

// Mock ConfigService
const mockConfigService = {
  get: jest.fn((key: string) => {
    switch (key) {
      case 'database':
        return mockDbConfig;
      default:
        return null;
    }
  }),
};

beforeAll(async () => {
  // Create test module with mocked dependencies
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      TypeOrmModule.forRootAsync({
        useFactory: () => mockDbConfig,
      }),
    ],
  })
    .overrideProvider(ConfigService)
    .useValue(mockConfigService)
    .compile();

  // Store module reference globally if needed
  global.__TEST_MODULE__ = moduleRef;
});

// Disable logging during tests
jest.mock('@nestjs/common', () => ({
  ...(jest.requireActual('@nestjs/common') as any),
  Logger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  })),
})); 