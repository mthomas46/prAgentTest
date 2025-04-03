export interface DatabaseMetrics {
  queryCount: number;
  queryTime: number;
  errorCount: number;
}

export interface MetricsData {
  timestamp: Date;
  metrics: {
    [key: string]: number;
  };
}

export interface LogData {
  timestamp: Date;
  level: string;
  message: string;
  context?: string;
  metadata?: Record<string, any>;
} 