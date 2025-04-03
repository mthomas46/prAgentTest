import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from '../services/task-service/src/entities/task.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const testDatabaseConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
  username: process.env.TEST_DB_USERNAME || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'postgres',
  database: process.env.TEST_DB_DATABASE || 'api_test',
  entities: [Task],
  synchronize: false, // Disable TypeORM sync since we're using Liquibase
  logging: false,
  migrationsRun: false, // Disable TypeORM migrations since we're using Liquibase
};
