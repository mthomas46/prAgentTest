import { registerAs } from '@nestjs/config';

export default registerAs('monitoring', () => ({
  prometheus: {
    enabled: true,
    port: process.env.PROMETHEUS_PORT || 9090,
    path: process.env.PROMETHEUS_PATH || '/metrics',
  },
  elasticsearch: {
    enabled: true,
    host: process.env.ELASTICSEARCH_HOST || 'http://elasticsearch:9200',
    index: process.env.ELASTICSEARCH_INDEX || 'api-gateway-logs',
  },
  rabbitmq: {
    enabled: true,
    url: process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672',
    queue: process.env.RABBITMQ_QUEUE || 'monitoring_queue',
  },
  metrics: {
    enabled: true,
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 2, 5],
  },
  logging: {
    enabled: true,
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
})); 