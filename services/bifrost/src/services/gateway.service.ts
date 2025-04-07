import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RouteRequestDto } from '../dto/route-request.dto';
import { firstValueFrom } from 'rxjs';
import { ServiceInfo } from '../interfaces/service-info.interface';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

@Injectable()
export class GatewayService {
  private serviceMap: Record<string, string>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Initialize service map from environment variables
    this.serviceMap = {
      task: this.configService.get('TASK_SERVICE_URL') || 'http://localhost:3001',
      user: this.configService.get('USER_SERVICE_URL') || 'http://localhost:3002',
      // Add more services as needed
    };
  }

  async routeRequest(request: RouteRequestDto) {
    const { service, method, path, headers, body, query } = request;

    // Validate service exists
    if (!this.serviceMap[service]) {
      throw new HttpException(`Service ${service} not found`, HttpStatus.NOT_FOUND);
    }

    // Construct target URL
    const baseUrl = this.serviceMap[service];
    const url = new URL(path, baseUrl);
    
    // Add query parameters if present
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    try {
      // Make the request to the target service
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url: url.toString(),
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          data: body,
        }),
      );

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorData = axiosError.response.data as ErrorResponse;
        // Forward the error response from the target service
        throw new HttpException(
          errorData.message || 'Service error',
          axiosError.response.status,
        );
      }
      throw new HttpException('Failed to connect to service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async forwardRequest(serviceId: string, path: string, method: string, data?: any): Promise<any> {
    const service = await this.getServiceInfo(serviceId);
    if (!service) {
      throw new HttpException(`Service with ID ${serviceId} not found`, HttpStatus.NOT_FOUND);
    }

    const url = `${service.url}${path}`;
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data,
        }),
      );

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorData = axiosError.response.data as ErrorResponse;
        throw new HttpException(
          errorData.message || 'Service error',
          axiosError.response.status,
        );
      }
      throw new HttpException('Failed to connect to service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getServiceInfo(serviceId: string): Promise<ServiceInfo | null> {
    // In a real implementation, this would fetch from a service registry
    return null;
  }
} 