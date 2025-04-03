export interface ServiceInfo {
  name: string;
  url: string;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  version?: string;
  lastChecked?: Date;
} 