import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { WebhookEvent, WebhookResponse, DocumentData } from './interfaces/webhook-event.interface';
import { DocumentService } from './document.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly supportedEvents = ['document.created', 'document.updated', 'document.deleted'] as const;
  private readonly supportedDocumentTypes = ['contract', 'policy', 'certificate', 'report'] as const;

  constructor(
    private readonly configService: ConfigService,
    private readonly documentService: DocumentService,
  ) {}

  async processWebhook(payload: any, signature: string): Promise<WebhookResponse> {
    try {
      // Verify webhook signature
      if (!this.verifySignature(payload, signature)) {
        this.logger.warn('Invalid webhook signature received');
        throw new BadRequestException('Invalid signature');
      }

      // Validate and parse webhook event
      const event = this.validateAndParseEvent(payload);
      
      // Process the webhook payload
      this.logger.log(`Processing webhook event: ${event.event}`, event);

      // Handle different event types
      await this.handleEvent(event);

      return {
        success: true,
        message: `Successfully processed ${event.event} event`,
        timestamp: new Date().toISOString(),
        correlationId: event.metadata?.correlationId,
        data: {
          documentId: event.data.documentId,
          status: 'processed',
        },
      };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      return {
        success: false,
        message: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private validateAndParseEvent(payload: any): WebhookEvent {
    if (!payload || typeof payload !== 'object') {
      throw new BadRequestException('Invalid payload format');
    }

    if (!payload.event || typeof payload.event !== 'string') {
      throw new BadRequestException('Missing or invalid event type');
    }

    if (!this.supportedEvents.includes(payload.event as any)) {
      throw new BadRequestException(`Unsupported event type: ${payload.event}`);
    }

    if (!payload.timestamp || !this.isValidISOString(payload.timestamp)) {
      throw new BadRequestException('Missing or invalid timestamp');
    }

    if (!payload.data) {
      throw new BadRequestException('Missing event data');
    }

    // Validate document data
    const documentData = this.validateDocumentData(payload.data);

    return {
      event: payload.event as WebhookEvent['event'],
      timestamp: payload.timestamp,
      data: documentData,
      metadata: payload.metadata,
    };
  }

  private validateDocumentData(data: any): DocumentData {
    if (!data.documentId || typeof data.documentId !== 'string') {
      throw new BadRequestException('Missing or invalid documentId');
    }

    if (!data.type || typeof data.type !== 'string') {
      throw new BadRequestException('Missing or invalid document type');
    }

    if (!this.supportedDocumentTypes.includes(data.type as any)) {
      throw new BadRequestException(`Unsupported document type: ${data.type}`);
    }

    if (!data.status || typeof data.status !== 'string') {
      throw new BadRequestException('Missing or invalid document status');
    }

    return {
      documentId: data.documentId,
      type: data.type,
      status: data.status,
      metadata: data.metadata,
    };
  }

  private async handleEvent(event: WebhookEvent): Promise<void> {
    switch (event.event) {
      case 'document.created':
        await this.handleDocumentCreated(event.data);
        break;
      case 'document.updated':
        await this.handleDocumentUpdated(event.data);
        break;
      case 'document.deleted':
        await this.handleDocumentDeleted(event.data);
        break;
      default:
        throw new BadRequestException(`Unsupported event type: ${event.event}`);
    }
  }

  private async handleDocumentCreated(data: DocumentData): Promise<void> {
    this.logger.log('Processing document creation:', data);
    await this.documentService.createDocument(data);
  }

  private async handleDocumentUpdated(data: DocumentData): Promise<void> {
    this.logger.log('Processing document update:', data);
    await this.documentService.updateDocument(data);
  }

  private async handleDocumentDeleted(data: DocumentData): Promise<void> {
    this.logger.log('Processing document deletion:', data);
    await this.documentService.deleteDocument(data);
  }

  private verifySignature(payload: any, signature: string): boolean {
    const webhookSecret = this.configService.get<string>('WEBHOOK_SECRET');
    if (!webhookSecret) {
      this.logger.warn('Webhook secret not configured');
      return false;
    }

    const hmac = crypto.createHmac('sha256', webhookSecret);
    const calculatedSignature = hmac
      .update(JSON.stringify(payload))
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );
  }

  private isValidISOString(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
} 