import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TaskPriority } from './entities/task.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');

  // Security middleware
  app.use(helmet());
  app.enableCors({
    origin: appConfig.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: appConfig.rateLimit.windowMs,
      max: appConfig.rateLimit.max,
    }),
  );

  // Compression
  app.use(compression());

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: errors => {
        const messages = errors.map(error => {
          if (error.property === 'priority') {
            return `Invalid priority value. Valid values are: ${Object.values(TaskPriority).join(', ')}`;
          }
          if (error.property === 'dueDate') {
            return 'Invalid date format. Please use ISO 8601 format (e.g., 2024-04-02T10:00:00Z)';
          }
          return Object.values(error.constraints || {}).join(', ');
        });
        return new BadRequestException(messages);
      },
    }),
  );

  // Global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
    new TimeoutInterceptor(),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API for managing tasks')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  const port = appConfig.port || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}

bootstrap();
