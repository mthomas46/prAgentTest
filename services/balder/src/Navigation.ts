export interface Service {
    name: string;
    url: string;
    swaggerUrl: string;
    description: string;
    category: string;
    status: string;
    hasHealthEndpoint: boolean;
}

export const services: Service[] = [
    { name: "Task Service", url: "http://localhost:3000", swaggerUrl: "http://localhost:3000/swagger-ui.html", description: "Core service for managing tasks and workflows", category: "Core Services", status: "available", hasHealthEndpoint: true },
    { name: "Balder Service", url: "http://localhost:3002", swaggerUrl: "http://localhost:3002/swagger-ui.html", description: "Service discovery and API gateway", category: "Core Services", status: "available", hasHealthEndpoint: true },
    { name: "Webhook Service", url: "http://localhost:3004", swaggerUrl: "http://localhost:3004/swagger-ui.html", description: "Handles webhook events and notifications", category: "Core Services", status: "available", hasHealthEndpoint: true },
    { name: "Heimdal Service", url: "http://localhost:3003", swaggerUrl: "http://localhost:3003/swagger-ui.html", description: "Authentication and authorization service", category: "Core Services", status: "available", hasHealthEndpoint: true },
    { name: "Bifrost Service", url: "http://localhost:3005", swaggerUrl: "http://localhost:3005/swagger-ui.html", description: "Integration and data transformation service", category: "Core Services", status: "available", hasHealthEndpoint: false },
    { name: "Brokkr Service", url: "http://localhost:3006", swaggerUrl: "http://localhost:3006/swagger-ui.html", description: "Document processing and workflow automation", category: "Core Services", status: "available", hasHealthEndpoint: false },
    { name: "Prometheus", url: "http://localhost:9090", swaggerUrl: "http://localhost:9090/graph", description: "Metrics collection and monitoring", category: "Monitoring", status: "available", hasHealthEndpoint: true },
    { name: "Grafana", url: "http://localhost:3001", swaggerUrl: "http://localhost:3001/api-docs", description: "Visualization and analytics dashboard", category: "Monitoring", status: "available", hasHealthEndpoint: true },
    { name: "Kibana", url: "http://localhost:5601", swaggerUrl: "http://localhost:5601/app/dev_tools#/console", description: "Log visualization and analysis", category: "Monitoring", status: "available", hasHealthEndpoint: true },
    { name: "Elasticsearch", url: "http://localhost:9200", swaggerUrl: "http://localhost:9200/_cat/indices?v", description: "Search and analytics engine", category: "Monitoring", status: "available", hasHealthEndpoint: true },
    { name: "Logstash", url: "http://localhost:9600", swaggerUrl: "http://localhost:9600/_node", description: "Log processing and pipeline", category: "Monitoring", status: "available", hasHealthEndpoint: true },
    { name: "Loki", url: "http://localhost:3100", swaggerUrl: "http://localhost:3100/metrics", description: "Log aggregation system designed for high-volume data", category: "Monitoring", status: "available", hasHealthEndpoint: true },
    { name: "Node Exporter", url: "http://localhost:9100", swaggerUrl: "http://localhost:9100/metrics", description: "System metrics collection", category: "Monitoring", status: "available", hasHealthEndpoint: true },
    { name: "AvettaDocAgent", url: "http://localhost:3009", swaggerUrl: "http://localhost:3009/swagger-ui.html", description: "Document processing and management", category: "Tools", status: "available", hasHealthEndpoint: false }
]; 