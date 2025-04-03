import { registerAs } from '@nestjs/config';

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