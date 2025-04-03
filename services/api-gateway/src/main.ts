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
    .setTitle('Microservices API Gateway')
    .setDescription('API Gateway for microservices architecture')
    .setVersion('1.0')
    .addTag('api-gateway', 'API Gateway endpoints')
    .addTag('document-service', 'Document Service endpoints')
    .addTag('task-service', 'Task Service endpoints')
    .addTag('webhook-service', 'Webhook Service endpoints')
    .addTag('monitoring-service', 'Monitoring Service endpoints')
    .addTag('service-discovery', 'Service Discovery endpoints')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API Gateway is running on port ${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api`);
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await sdk.shutdown();
    await app.close();
    process.exit(0);
  });
}

bootstrap(); 