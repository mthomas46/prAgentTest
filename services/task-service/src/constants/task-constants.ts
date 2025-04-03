export const TaskStatus = {
  PENDING: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  CANCELLED: 3
} as const;

export const TaskPriority = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  URGENT: 3
} as const;

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];
export type TaskPriorityType = typeof TaskPriority[keyof typeof TaskPriority]; 