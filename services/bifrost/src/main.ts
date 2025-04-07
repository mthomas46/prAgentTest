import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import sdk from './tracing';
import { CORS_OPTIONS } from './cors-options';
import helmet from 'helmet';

async function bootstrap() {
  // Initialize OpenTelemetry
  await sdk.start();

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Setup Swagger
  const description = `
    Bifrost API Gateway
    Acts as a central entry point for all microservices, handling:
    - Request routing and load balancing
    - Authentication and authorization
    - Request/response transformation
    - Service discovery
    - Monitoring and logging
    - Rate limiting and throttling
  `;

  const options = new DocumentBuilder()
    .setTitle('Bifrost API Gateway')
    .setDescription(description)
    .setVersion('1.0')
    .addTag('bifrost')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API Gateway is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api`);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await sdk.shutdown();
    await app.close();
    process.exit(0);
  });
}

bootstrap();
