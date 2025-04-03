export enum EventType {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED'
}

export interface IEvent<T = any> {
  id: string;
  type: EventType;
  data: T;
  timestamp: Date;
  metadata?: Record<string, any>;
  version?: number;
} 