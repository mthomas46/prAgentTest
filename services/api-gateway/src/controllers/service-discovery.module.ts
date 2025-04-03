import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceDiscoveryController } from './service-discovery.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SERVICE_DISCOVERY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'service_discovery_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [ServiceDiscoveryController],
})
export class ServiceDiscoveryModule {} 