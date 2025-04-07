import { config } from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Task } from './src/entities/task.entity';
import testDatabaseConfig from './test/test-database.config';

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

export async function createTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [testDatabaseConfig],
        cache: true,
      }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          ...configService.get('database'),
          entities: [Task],
        }),
        inject: [ConfigService],
      }),
    ],
  }).compile();
}

export async function createTestingApp(): Promise<INestApplication> {
  const moduleFixture = await createTestingModule();
  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

beforeAll(async () => {
  // Any global setup can go here
});

afterAll(async () => {
  // Any global cleanup can go here
}); 