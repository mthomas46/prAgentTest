export interface ServiceInfo {
  id: string;
  name: string;
  version: string;
  url: string;
  status: 'UP' | 'DOWN';
  health: {
    status: 'UP' | 'DOWN';
    details?: Record<string, any>;
  };
  metadata?: Record<string, any>;
  lastUpdated: Date;
} 