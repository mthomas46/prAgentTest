import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private metrics: Map<string, number> = new Map();
  private requestCounts: Map<string, number> = new Map();

  incrementRequest(method: string, path: string, statusCode: number) {
    const key = `${method}_${path}_${statusCode}`;
    this.requestCounts.set(key, (this.requestCounts.get(key) || 0) + 1);
  }

  getMetrics(): string {
    let output = '';
    
    // Add request counts
    output += '# HELP http_requests_total Total number of HTTP requests\n';
    output += '# TYPE http_requests_total counter\n';
    this.requestCounts.forEach((count, key) => {
      const [method, path, statusCode] = key.split('_');
      output += `http_requests_total{method="${method}",path="${path}",status="${statusCode}"} ${count}\n`;
    });

    return output;
  }
} 