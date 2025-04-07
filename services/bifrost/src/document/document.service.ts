import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentService {
  constructor(private readonly documentClient: ClientProxy) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const result = await firstValueFrom(
      this.documentClient.send('create_document', createDocumentDto)
    );
    return result;
  }

  async findAll(): Promise<Document[]> {
    const result = await firstValueFrom(
      this.documentClient.send('find_all_documents', {})
    );
    return result;
  }

  async findOne(id: string): Promise<Document> {
    const result = await firstValueFrom(
      this.documentClient.send('find_one_document', { id })
    );
    return result;
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(
      this.documentClient.send('remove_document', { id })
    );
  }
} 