import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import sdk from './tracing';

async function bootstrap() {
  // Initialize OpenTelemetry
  await sdk.start();

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway for microservices')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3002;
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
