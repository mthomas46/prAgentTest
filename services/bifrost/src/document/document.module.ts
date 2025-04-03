import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DocumentController } from './document.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DOCUMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'document_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [DocumentController],
})
export class DocumentModule {} 