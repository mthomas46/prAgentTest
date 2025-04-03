import { Controller, Inject, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@ApiTags('documents')
@Controller('documents')
export class DocumentController {
  constructor(@Inject('DOCUMENT_SERVICE') private readonly documentService: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  async createDocument(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.send('createDocument', createDocumentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'Returns all documents' })
  async getAllDocuments() {
    return this.documentService.send('getAllDocuments', {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Returns the document' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocument(@Param('id') id: string) {
    return this.documentService.send('getDocument', { id });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update document' })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async updateDocument(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentService.send('updateDocument', { id, ...updateDocumentDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async deleteDocument(@Param('id') id: string) {
    return this.documentService.send('deleteDocument', { id });
  }
}
