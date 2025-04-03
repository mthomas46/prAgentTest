export enum EventType {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
  TASK_RESTORED = 'TASK_RESTORED'
}

export interface IEvent<T = any> {
  type: EventType;
  data: T;
  timestamp: Date;
  source: string;
  correlationId?: string;
  version?: string;
}

export interface ITaskEventData {
  taskId: string;
  previousState?: any;
  currentState: any;
  userId?: string;
  metadata?: Record<string, any>;
}

export const EVENT_VERSION = 1; 