import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000; // 1 second

  async withRetry<T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        attempt++;
        
        if (attempt === maxRetries) {
          this.logger.error(
            `Failed to execute ${context} after ${maxRetries} attempts`,
            error.stack
          );
          throw error;
        }

        const delay = this.baseDelay * Math.pow(2, attempt - 1);
        this.logger.warn(
          `Attempt ${attempt} failed for ${context}, retrying in ${delay}ms`,
          error.stack
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
} 