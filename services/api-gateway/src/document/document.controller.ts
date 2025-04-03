import { Controller, Get, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('documents')
@Controller('documents')
export class DocumentController {
  constructor(
    @Inject('DOCUMENT_SERVICE') private readonly documentClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  async createDocument(@Body() document: any) {
    return this.documentClient.send('create_document', document);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'Return all documents' })
  async findAllDocuments() {
    return this.documentClient.send('find_all_documents', {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document by id' })
  @ApiResponse({ status: 200, description: 'Return the document' })
  async findOneDocument(@Param('id') id: string) {
    return this.documentClient.send('find_one_document', { id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  async removeDocument(@Param('id') id: string) {
    return this.documentClient.send('remove_document', { id });
  }

  @Get('health')
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({ status: 200, description: 'Return health status' })
  async getHealth() {
    return this.documentClient.send('get_health', {});
  }
} 