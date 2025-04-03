import { Controller, Get, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateDocumentDto } from './dto/create-document.dto';

@ApiTags('documents')
@Controller('documents')
export class DocumentController {
  constructor(
    @Inject('DOCUMENT_SERVICE') private readonly documentClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new document',
    description: 'Creates a new document with the provided content and metadata'
  })
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Document created successfully',
    type: CreateDocumentDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid document data'
  })
  async createDocument(@Body() document: CreateDocumentDto) {
    return this.documentClient.send('create_document', document);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all documents',
    description: 'Retrieves a list of all documents in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all documents',
    type: [CreateDocumentDto]
  })
  async findAllDocuments() {
    return this.documentClient.send('find_all_documents', {});
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a document by id',
    description: 'Retrieves a specific document by its unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The unique identifier of the document',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the document',
    type: CreateDocumentDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Document not found'
  })
  async findOneDocument(@Param('id') id: string) {
    return this.documentClient.send('find_one_document', { id });
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a document',
    description: 'Removes a document from the system'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The unique identifier of the document to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Document deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Document not found'
  })
  async removeDocument(@Param('id') id: string) {
    return this.documentClient.send('remove_document', { id });
  }

  @Get('health')
  @ApiOperation({ 
    summary: 'Get service health status',
    description: 'Checks the health status of the document service'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
          description: 'The health status of the service'
        },
        timestamp: {
          type: 'string',
          example: '2025-04-03T09:00:00.000Z',
          description: 'The timestamp of the health check'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Service is unhealthy'
  })
  async getHealth() {
    return this.documentClient.send('get_health', {});
  }
} 