import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { TaskPriority } from '../src/entities/task.entity';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from '../src/common/interceptors/timeout.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

let app: any;
let dataSource: DataSource;

beforeAll(async () => {
  // Only initialize database if DB_ENABLED is true
  if (process.env.DB_ENABLED === 'true') {
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'api_test',
      entities: ['src/**/*.entity{.ts,.js}'],
      synchronize: true,
      dropSchema: true,
      logging: false,
    } as any);
    await dataSource.initialize();
  }

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
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
            return `Invalid priority value. Valid values are: ${Object.values(TaskPriority).join(', ')}`;
          }
          if (error.property === 'dueDate') {
            return 'Invalid date format. Please use ISO 8601 format (e.g., 2024-04-02T10:00:00Z)';
          }
          if (error.property === 'title' && error.constraints?.isNotEmpty) {
            return 'Title cannot be empty';
          }
          return Object.values(error.constraints || {}).join(', ');
        });
        return new BadRequestException(messages);
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
    new TimeoutInterceptor(),
  );

  await app.init();
});

afterAll(async () => {
  if (dataSource) {
    await dataSource.destroy();
  }
  await app.close();
});
