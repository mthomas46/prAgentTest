import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { WebhookModule } from './webhook/webhook.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ServiceDiscoveryModule } from './service-discovery/service-discovery.module';
import { DocumentModule } from './document/document.module';
import { CommonModule } from '../../shared/modules/common.module';

@Module({
  imports: [
    CommonModule,
    TaskModule,
    WebhookModule,
    MonitoringModule,
    ServiceDiscoveryModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
