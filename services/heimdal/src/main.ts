import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors();

  // Serve static files from the public directory
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: 'index.html',
  });

  const config = new DocumentBuilder()
    .setTitle('Heimdal Service API')
    .setDescription('Named after the Norse god Heimdall, the watchman of the gods who guards the Bifrost bridge. This service watches over the entire application, providing immediate health status and version information for all services.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3003);
  console.log('Heimdal service is running on port 3003');
}
bootstrap(); 