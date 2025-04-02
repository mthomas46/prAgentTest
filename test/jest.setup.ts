import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from '../src/entities/task.entity';

let dataSource: DataSource;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'pr_agent_test',
    entities: [Task],
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();
});

afterAll(async () => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }
}); 