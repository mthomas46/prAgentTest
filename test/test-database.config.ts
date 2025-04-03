import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TEST_DB_HOST ? process.env.TEST_DB_HOST : 'localhost',
  port: process.env.TEST_DB_PORT ? parseInt(process.env.TEST_DB_PORT, 10) : 5432,
  username: process.env.TEST_DB_USERNAME ? process.env.TEST_DB_USERNAME : 'postgres',
  password: process.env.TEST_DB_PASSWORD ? process.env.TEST_DB_PASSWORD : 'postgres',
  database: process.env.TEST_DB_DATABASE ? process.env.TEST_DB_DATABASE : 'api_test',
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true,
  logging: false,
  ssl: false,
};
