import { Controller, Get, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(
    @Inject('MONITORING_SERVICE') private readonly monitoringClient: ClientProxy,
  ) {}

  @Post('metrics')
  @ApiOperation({ summary: 'Create a new metric' })
  @ApiResponse({ status: 201, description: 'Metric created successfully' })
  async createMetric(@Body() metric: any) {
    return this.monitoringClient.send('create_metric', metric);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get all metrics' })
  @ApiResponse({ status: 200, description: 'Return all metrics' })
  async findAllMetrics() {
    return this.monitoringClient.send('find_all_metrics', {});
  }

  @Get('metrics/:id')
  @ApiOperation({ summary: 'Get a metric by id' })
  @ApiResponse({ status: 200, description: 'Return the metric' })
  async findOneMetric(@Param('id') id: string) {
    return this.monitoringClient.send('find_one_metric', { id });
  }

  @Delete('metrics/:id')
  @ApiOperation({ summary: 'Delete a metric' })
  @ApiResponse({ status: 200, description: 'Metric deleted successfully' })
  async removeMetric(@Param('id') id: string) {
    return this.monitoringClient.send('remove_metric', { id });
  }

  @Get('health')
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({ status: 200, description: 'Return health status' })
  async getHealth() {
    return this.monitoringClient.send('get_health', {});
  }
} 