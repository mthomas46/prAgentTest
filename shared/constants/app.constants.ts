export const API_PREFIX = 'api';
export const API_VERSION = 'v1';
export const API_TITLE = 'Microservices API';
export const API_DESCRIPTION = 'API documentation for microservices architecture';
export const API_TAG = 'microservices';

export const RABBITMQ_QUEUES = {
  TASK: 'task_queue',
  DOCUMENT: 'document_queue',
  WEBHOOK: 'webhook_queue',
  METRICS: 'metrics_queue',
};

export const RABBITMQ_EXCHANGES = {
  TASK: 'task_exchange',
  DOCUMENT: 'document_exchange',
  WEBHOOK: 'webhook_exchange',
  METRICS: 'metrics_exchange',
};

export const RABBITMQ_ROUTING_KEYS = {
  TASK_CREATED: 'task.created',
  TASK_UPDATED: 'task.updated',
  TASK_DELETED: 'task.deleted',
  DOCUMENT_CREATED: 'document.created',
  DOCUMENT_UPDATED: 'document.updated',
  DOCUMENT_DELETED: 'document.deleted',
  WEBHOOK_CREATED: 'webhook.created',
  WEBHOOK_UPDATED: 'webhook.updated',
  WEBHOOK_DELETED: 'webhook.deleted',
  METRICS_UPDATED: 'metrics.updated',
};

export const DATABASE_CONNECTION = 'default';
export const DATABASE_ENTITIES = ['dist/**/*.entity{.ts,.js}'];
export const DATABASE_MIGRATIONS = ['dist/migrations/*{.ts,.js}'];
export const DATABASE_MIGRATIONS_DIR = 'src/migrations';

export const CORS_OPTIONS = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
};

export const RATE_LIMIT_OPTIONS = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};

export const LOGGER_OPTIONS = {
  level: 'info',
  json: false,
  timestamp: true,
  colorize: true,
}; 