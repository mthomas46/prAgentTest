import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`Loki service is running on port ${port}`);
  logger.warn('WARNING: This service should only be accessed by automated jobs for controlled chaos testing');
}
bootstrap(); 