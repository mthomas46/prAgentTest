import { Controller, Post, Get, Param, Logger } from '@nestjs/common';
import { LokiService } from '../services/loki.service';

@Controller('loki')
export class LokiController {
  private readonly logger = new Logger(LokiController.name);

  constructor(private readonly lokiService: LokiService) {}

  @Post('bring-down/:serviceName')
  async bringDownService(@Param('serviceName') serviceName: string) {
    this.logger.warn(`Received request to bring down service: ${serviceName}`);
    return this.lokiService.bringDownService(serviceName);
  }

  @Post('bring-up/:serviceName')
  async bringUpService(@Param('serviceName') serviceName: string) {
    this.logger.warn(`Received request to bring up service: ${serviceName}`);
    return this.lokiService.bringUpService(serviceName);
  }

  @Get('status/:serviceName')
  async getServiceStatus(@Param('serviceName') serviceName: string) {
    this.logger.log(`Received request for service status: ${serviceName}`);
    return this.lokiService.getServiceStatus(serviceName);
  }
} 