import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WEBHOOK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'webhook_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [WebhookController],
})
export class WebhookModule {} 