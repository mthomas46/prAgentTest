import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { testDatabaseConfig } from './test-database.config';
import '@jest/globals';

let app: any;
let dataSource: DataSource;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'postgres',
    host: testDatabaseConfig.host,
    port: testDatabaseConfig.port,
    username: testDatabaseConfig.username,
    password: testDatabaseConfig.password,
    database: testDatabaseConfig.database,
    entities: testDatabaseConfig.entities,
    migrations: ['src/migrations/*.ts'],
    migrationsRun: true,
    logging: false,
  });
  await dataSource.initialize();
  await dataSource.runMigrations();

  const moduleRef = await Test.createTestingModule({
    imports: [],
  }).compile();

  app = moduleRef.createNestApplication();

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: errors => {
        const messages = errors.map(error => {
          if (error.property === 'priority') {
            return `Invalid priority value. Valid values are: ${Object.values(['LOW', 'MEDIUM', 'HIGH']).join(', ')}`;
          }
          if (error.property === 'dueDate') {
            return 'Invalid date format. Please use ISO 8601 format (e.g., 2024-04-02T10:00:00Z)';
          }
          if (error.property === 'title' && error.constraints?.isNotEmpty) {
            return 'Title cannot be empty';
          }
          return error.constraints ? Object.values(error.constraints).join(', ') : '';
        });
        return new BadRequestException(messages);
      },
    }),
  );

  await app.init();
});

afterAll(async () => {
  if (dataSource) {
    await dataSource.undoLastMigration();
    await dataSource.destroy();
  }
  await app.close();
});

// Set test timeout
jest.setTimeout(30000);
