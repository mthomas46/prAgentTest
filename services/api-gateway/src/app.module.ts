import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentModule } from './controllers/document.module';
import { TaskModule } from './controllers/task.module';
import { WebhookModule } from './controllers/webhook.module';
import { MonitoringModule } from './controllers/monitoring.module';
import { ServiceDiscoveryModule } from './controllers/service-discovery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DocumentModule,
    TaskModule,
    WebhookModule,
    MonitoringModule,
    ServiceDiscoveryModule,
  ],
})
export class AppModule {} 