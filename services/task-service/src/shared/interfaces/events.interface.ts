export interface IEvent<T = any> {
  id: string;
  type: string;
  data: T;
  timestamp: Date;
  metadata?: Record<string, any>;
} 