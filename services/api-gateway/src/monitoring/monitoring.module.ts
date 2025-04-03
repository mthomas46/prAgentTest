import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MonitoringController } from './monitoring.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MONITORING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'monitoring_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [MonitoringController],
})
export class MonitoringModule {} 