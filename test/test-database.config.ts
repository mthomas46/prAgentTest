import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.TEST_DB_HOST ?? 'localhost',
  port: parseInt(process.env.TEST_DB_PORT ?? '5432', 10),
  username: process.env.TEST_DB_USERNAME ?? 'postgres',
  password: process.env.TEST_DB_PASSWORD ?? 'postgres',
  database: process.env.TEST_DB_DATABASE ?? 'pr_agent_test',
  synchronize: true, // Always true for tests
  logging: false, // Disable logging for tests
  dropSchema: true, // Drop schema before each test
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
})); 