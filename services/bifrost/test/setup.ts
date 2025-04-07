import { Test } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Hel - Test Database Configuration for Bifrost
 * Named after the Norse realm of the dead, serves as the home for test data.
 * Production data can be copied here for testing but will be rolled back after automated tests.
 */
export const testDbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
  username: process.env.TEST_DB_USERNAME || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'postgres',
  database: process.env.TEST_DB_DATABASE || 'hel',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true,
};

// Mock ConfigService
const mockConfigService = {
  get: jest.fn((key: string) => {
    switch (key) {
      case 'database':
        return testDbConfig;
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
        useFactory: () => testDbConfig,
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