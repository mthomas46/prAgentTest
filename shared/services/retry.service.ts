import { Injectable, Logger } from '@nestjs/common';
import { IRetryConfig, DEFAULT_RETRY_CONFIG } from '../interfaces/retry.interface';

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  async withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<IRetryConfig> = {},
  ): Promise<T> {
    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError: Error;
    let attempt = 0;

    while (attempt < retryConfig.maxAttempts) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        attempt++;

        if (attempt === retryConfig.maxAttempts) {
          this.logger.error(
            `Operation failed after ${attempt} attempts: ${error.message}`,
            error.stack,
          );
          throw error;
        }

        const delay = this.calculateDelay(attempt, retryConfig);
        this.logger.warn(
          `Operation failed (attempt ${attempt}/${retryConfig.maxAttempts}). Retrying in ${delay}ms...`,
        );
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  private calculateDelay(attempt: number, config: IRetryConfig): number {
    let delay = config.initialDelay * Math.pow(config.backoffFactor, attempt - 1);
    
    if (config.jitter) {
      const jitter = Math.random() * 0.3 * delay;
      delay += jitter;
    }

    return Math.min(delay, config.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 