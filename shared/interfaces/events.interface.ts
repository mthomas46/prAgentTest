export enum EventType {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
}

export interface IEvent<T = any> {
  version: number;
  type: EventType;
  data: T;
  timestamp: Date;
  source: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface ITaskEventData {
  taskId: string;
  previousState?: any;
  currentState: any;
  userId?: string;
  metadata?: Record<string, any>;
}

export const EVENT_VERSION = 1; 