import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { GatewayService } from '../services/gateway.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RouteRequestDto } from '../dto/route-request.dto';

@ApiTags('Gateway')
@Controller('gateway')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('route')
  @ApiOperation({ summary: 'Route a request to the appropriate service' })
  @ApiResponse({ status: 200, description: 'Request successfully routed' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async routeRequest(@Body() request: RouteRequestDto) {
    try {
      return await this.gatewayService.routeRequest(request);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Check gateway health status' })
  @ApiResponse({ status: 200, description: 'Gateway is healthy' })
  async healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
} 