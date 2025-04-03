import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: Partial<Document>): Promise<Document> {
    const document = this.documentRepository.create(createDocumentDto);
    return this.documentRepository.save(document);
  }

  async findAll(status?: string): Promise<Document[]> {
    const query = this.documentRepository.createQueryBuilder('document');
    if (status) {
      query.where('document.status = :status', { status });
    }
    return query.getMany();
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async update(id: string, updateDocumentDto: Partial<Document>): Promise<Document> {
    const document = await this.findOne(id);
    Object.assign(document, updateDocumentDto);
    return this.documentRepository.save(document);
  }

  async remove(id: string): Promise<void> {
    const result = await this.documentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
  }
} 