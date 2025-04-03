import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  create(@Body() createDocumentDto: Partial<Document>) {
    return this.documentService.create(createDocumentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'Return all documents' })
  findAll(@Query('status') status?: string) {
    return this.documentService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document by id' })
  @ApiResponse({ status: 200, description: 'Return the document' })
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a document' })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  update(@Param('id') id: string, @Body() updateDocumentDto: Partial<Document>) {
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  remove(@Param('id') id: string) {
    return this.documentService.remove(id);
  }
} 