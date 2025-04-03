import { Module } from '@nestjs/common';
import { ServiceDiscoveryService } from './service-discovery.service';
import { ServiceDiscoveryController } from './service-discovery.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ServiceDiscoveryController],
  providers: [ServiceDiscoveryService],
  exports: [ServiceDiscoveryService],
})
export class ServiceDiscoveryModule {} 