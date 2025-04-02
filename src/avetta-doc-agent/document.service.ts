import { Injectable, Logger } from '@nestjs/common';
import { DocumentData } from './interfaces/webhook-event.interface';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  private readonly documents = new Map<string, DocumentData>();

  async createDocument(data: DocumentData): Promise<void> {
    this.logger.log(`Creating document: ${data.documentId}`);
    this.documents.set(data.documentId, {
      ...data,
      status: 'created',
    });
  }

  async updateDocument(data: DocumentData): Promise<void> {
    this.logger.log(`Updating document: ${data.documentId}`);
    if (!this.documents.has(data.documentId)) {
      this.logger.warn(`Document not found: ${data.documentId}`);
      return;
    }
    this.documents.set(data.documentId, {
      ...data,
      status: 'updated',
    });
  }

  async deleteDocument(data: DocumentData): Promise<void> {
    this.logger.log(`Deleting document: ${data.documentId}`);
    if (!this.documents.has(data.documentId)) {
      this.logger.warn(`Document not found: ${data.documentId}`);
      return;
    }
    this.documents.delete(data.documentId);
  }

  async getDocument(documentId: string): Promise<DocumentData | undefined> {
    return this.documents.get(documentId);
  }

  async listDocuments(): Promise<DocumentData[]> {
    return Array.from(this.documents.values());
  }
} 