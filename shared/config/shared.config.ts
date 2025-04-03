import { registerAs } from '@nestjs/config';

export const sharedConfig = registerAs('shared', () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'api',
  },
  rabbitmq: {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    username: process.env.RABBITMQ_USERNAME || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },
  elasticsearch: {
    host: process.env.ELASTICSEARCH_HOST || 'localhost',
    port: parseInt(process.env.ELASTICSEARCH_PORT || '9200', 10),
  },
  prometheus: {
    port: parseInt(process.env.PROMETHEUS_PORT || '9090', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
})); 