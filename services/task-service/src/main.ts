import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('TaskService');
  
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'task_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
  logger.log('Task service is running');
}

bootstrap(); 