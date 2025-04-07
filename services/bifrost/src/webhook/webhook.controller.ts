import { Controller, Get, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateWebhookDto } from './dto/create-webhook.dto';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(
    @Inject('WEBHOOK_SERVICE') private readonly webhookService: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Register a new webhook',
    description: 'Creates a new webhook endpoint for receiving event notifications'
  })
  @ApiBody({ type: CreateWebhookDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Webhook registered successfully',
    type: CreateWebhookDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid webhook configuration'
  })
  async createWebhook(@Body() createWebhookDto: CreateWebhookDto) {
    return this.webhookService.send({ cmd: 'createWebhook' }, createWebhookDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all webhooks',
    description: 'Retrieves a list of all registered webhooks'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all webhooks',
    type: [CreateWebhookDto]
  })
  async findAll() {
    return this.webhookService.send({ cmd: 'findAllWebhooks' }, {});
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a webhook by id',
    description: 'Retrieves a specific webhook configuration by its unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The unique identifier of the webhook',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the webhook configuration',
    type: CreateWebhookDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Webhook not found'
  })
  async findOne(@Param('id') id: string) {
    return this.webhookService.send({ cmd: 'findOneWebhook' }, { id });
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a webhook',
    description: 'Removes a webhook configuration from the system'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The unique identifier of the webhook to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Webhook deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Webhook not found'
  })
  async remove(@Param('id') id: string) {
    return this.webhookService.send({ cmd: 'removeWebhook' }, { id });
  }
} 