import { NestFactory } from '@nestjs/core';
import { AvettaDocAgentModule } from './avetta-doc-agent.module';
import { LoggerService } from './logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AvettaDocAgentModule, {
    logger: new LoggerService(),
  });

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-webhook-signature'],
  });

  // Start the server
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`AvettaDocAgent is running on: http://[::1]:${port}`);
}

bootstrap(); 