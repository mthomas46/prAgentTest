"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_service_1 = require("./metrics.service");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)('MetricsService', () => {
    let service;
    (0, globals_1.beforeEach)(() => {
        service = new metrics_service_1.MetricsService();
    });
    (0, globals_1.it)('should be defined', () => {
        (0, globals_1.expect)(service).toBeDefined();
    });
    (0, globals_1.it)('should initialize with empty metrics', () => {
        const metrics = service.getMetrics();
        (0, globals_1.expect)(metrics).toBe('# HELP http_requests_total Total number of HTTP requests\n# TYPE http_requests_total counter\n');
    });
    (0, globals_1.it)('should increment request metrics', () => {
        service.incrementRequest('GET', '/health', 200);
        service.incrementRequest('POST', '/webhook', 200);
        service.incrementRequest('GET', '/health', 400);
        const metrics = service.getMetrics();
        (0, globals_1.expect)(metrics).toContain('http_requests_total{method="GET",path="/health",status="200"} 1');
        (0, globals_1.expect)(metrics).toContain('http_requests_total{method="POST",path="/webhook",status="200"} 1');
        (0, globals_1.expect)(metrics).toContain('http_requests_total{method="GET",path="/health",status="400"} 1');
    });
    (0, globals_1.it)('should handle multiple requests to same endpoint', () => {
        service.incrementRequest('GET', '/health', 200);
        service.incrementRequest('GET', '/health', 200);
        service.incrementRequest('GET', '/health', 200);
        const metrics = service.getMetrics();
        (0, globals_1.expect)(metrics).toContain('http_requests_total{method="GET",path="/health",status="200"} 3');
    });
});
//# sourceMappingURL=metrics.service.spec.js.map