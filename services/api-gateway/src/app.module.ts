import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { WebhookModule } from './webhook/webhook.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ServiceDiscoveryModule } from './service-discovery/service-discovery.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
