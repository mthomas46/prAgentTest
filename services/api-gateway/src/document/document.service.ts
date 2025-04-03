import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Document } from './interfaces/document.interface';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('DOCUMENT_SERVICE') private readonly documentClient: ClientProxy,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentClient.send('create_document', createDocumentDto);
  }

  async findAll(): Promise<Document[]> {
    return this.documentClient.send('find_all_documents', {});
  }

  async findOne(id: string): Promise<Document> {
    return this.documentClient.send('find_one_document', { id });
  }

  async remove(id: string): Promise<void> {
    return this.documentClient.send('remove_document', { id });
  }
} 