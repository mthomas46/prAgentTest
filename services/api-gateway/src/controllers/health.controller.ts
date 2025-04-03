import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API Gateway health' })
  @ApiResponse({ status: 200, description: 'API Gateway is healthy' })
  async checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('version')
  @ApiOperation({ summary: 'Get API Gateway version' })
  @ApiResponse({ status: 200, description: 'Returns API Gateway version' })
  async getVersion() {
    return {
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}
