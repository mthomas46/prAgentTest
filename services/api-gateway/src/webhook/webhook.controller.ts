import { Controller, Get, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(
    @Inject('WEBHOOK_SERVICE') private readonly webhookService: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new webhook' })
  @ApiResponse({ status: 201, description: 'Webhook registered successfully' })
  async createWebhook(@Body() createWebhookDto: any) {
    return this.webhookService.send({ cmd: 'createWebhook' }, createWebhookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all webhooks' })
  @ApiResponse({ status: 200, description: 'Return all webhooks' })
  async findAll() {
    return this.webhookService.send({ cmd: 'findAllWebhooks' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a webhook by id' })
  @ApiResponse({ status: 200, description: 'Return the webhook' })
  async findOne(@Param('id') id: string) {
    return this.webhookService.send({ cmd: 'findOneWebhook' }, { id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a webhook' })
  @ApiResponse({ status: 200, description: 'Webhook deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.webhookService.send({ cmd: 'removeWebhook' }, { id });
  }
} 