export interface IRetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  jitter: boolean;
}

export const DEFAULT_RETRY_CONFIG: IRetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
  jitter: true,
}; 