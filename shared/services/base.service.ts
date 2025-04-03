import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RABBITMQ_QUEUES } from '../constants/app.constants';

@Injectable()
export abstract class BaseService<T> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly client: ClientProxy,
    protected readonly queue: string,
  ) {}

  protected send(pattern: string, data: any): Observable<T> {
    this.logger.debug(`Sending message to ${this.queue}: ${pattern}`);
    return this.client.send(pattern, data);
  }

  protected emit(pattern: string, data: any): void {
    this.logger.debug(`Emitting message to ${this.queue}: ${pattern}`);
    this.client.emit(pattern, data);
  }

  protected handleError(error: Error): void {
    this.logger.error(`Error in ${this.queue}: ${error.message}`, error.stack);
    throw error;
  }

  protected logOperation(operation: string, data?: any): void {
    this.logger.log(`${operation} in ${this.queue}${data ? `: ${JSON.stringify(data)}` : ''}`);
  }
} 