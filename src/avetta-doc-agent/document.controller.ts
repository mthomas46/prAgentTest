import { Controller, Get, Param, Logger } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentData } from './interfaces/webhook-event.interface';
import { MetricsService } from './metrics.service';

@Controller('documents')
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(
    private readonly documentService: DocumentService,
    private readonly metricsService: MetricsService,
  ) {}

  @Get()
  async listDocuments(): Promise<{ documents: DocumentData[] }> {
    this.logger.log('Listing all documents');
    this.metricsService.incrementRequest('GET', '/documents', 200);
    const documents = await this.documentService.listDocuments();
    return { documents };
  }

  @Get(':id')
  async getDocument(@Param('id') id: string): Promise<{ document: DocumentData | null }> {
    this.logger.log(`Getting document: ${id}`);
    this.metricsService.incrementRequest('GET', '/documents/:id', 200);
    const document = await this.documentService.getDocument(id);
    return { document: document || null };
  }
} 