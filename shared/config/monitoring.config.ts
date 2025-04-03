import { registerAs } from '@nestjs/config';
import { PrometheusOptions } from '@willsoto/nestjs-prometheus';
import { ConfigService } from '@nestjs/config';

export default registerAs('monitoring', () => ({
  prometheus: {
    port: parseInt(process.env.PROMETHEUS_PORT || '9090', 10),
    path: process.env.PROMETHEUS_PATH || '/metrics',
  },
  grafana: {
    port: parseInt(process.env.GRAFANA_PORT || '3001', 10),
    adminUser: process.env.GRAFANA_ADMIN_USER || 'admin',
    adminPassword: process.env.GRAFANA_ADMIN_PASSWORD || 'admin',
  },
  jaeger: {
    enabled: process.env.JAEGER_ENABLED === 'true',
    host: process.env.JAEGER_HOST || 'localhost',
    port: parseInt(process.env.JAEGER_PORT || '6832', 10),
  },
  openTelemetry: {
    enabled: process.env.OTEL_ENABLED === 'true',
    serviceName: process.env.OTEL_SERVICE_NAME || 'api-gateway',
    endpoint: process.env.OTEL_ENDPOINT || 'http://localhost:4317',
  },
}));

export const getMonitoringConfig = (configService: ConfigService): PrometheusOptions => ({
  defaultMetrics: {
    enabled: true,
    config: {
      prefix: configService.get('METRICS_PREFIX', 'app_'),
    },
  },
  defaultLabels: {
    app: configService.get('APP_NAME', 'app'),
    env: configService.get('NODE_ENV', 'development'),
  },
});

export const getElasticsearchConfig = (configService: ConfigService) => ({
  node: configService.get('ELASTICSEARCH_URL', 'http://localhost:9200'),
  auth: {
    username: configService.get('ELASTICSEARCH_USERNAME'),
    password: configService.get('ELASTICSEARCH_PASSWORD'),
  },
  ssl: {
    rejectUnauthorized: configService.get('NODE_ENV') === 'production',
  },
});

export const getLogstashConfig = (configService: ConfigService) => ({
  node: configService.get('LOGSTASH_URL', 'http://localhost:5044'),
  indexPrefix: configService.get('LOGSTASH_INDEX_PREFIX', 'logs'),
}); 