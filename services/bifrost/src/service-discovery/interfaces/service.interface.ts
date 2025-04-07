export interface Service {
  id: string;
  name: string;
  url: string;
  version?: string;
  status: 'UP' | 'DOWN';
  lastHeartbeat: Date;
  createdAt: Date;
  updatedAt: Date;
} 