import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Heimdal Service API')
    .setDescription('Named after the Norse god Heimdall, the watchman of the gods who guards the Bifrost bridge. This service watches over the entire application, providing immediate health status and version information for all services.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3006);
  console.log('Heimdal service is running on port 3006');
}
bootstrap(); 