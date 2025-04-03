"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_controller_1 = require("./metrics.controller");
const metrics_service_1 = require("./metrics.service");
const globals_1 = require("@jest/globals");
globals_1.jest.mock('./metrics.service');
(0, globals_1.describe)('MetricsController', () => {
    let controller;
    let metricsService;
    (0, globals_1.beforeEach)(() => {
        metricsService = new metrics_service_1.MetricsService();
        controller = new metrics_controller_1.MetricsController(metricsService);
    });
    (0, globals_1.it)('should be defined', () => {
        (0, globals_1.expect)(controller).toBeDefined();
    });
    (0, globals_1.it)('should get metrics', () => {
        const mockMetrics = '# HELP http_requests_total Total number of HTTP requests\n# TYPE http_requests_total counter\nhttp_requests_total{method="GET",path="/health",status="200"} 1';
        metricsService.getMetrics.mockReturnValue(mockMetrics);
        const result = controller.getMetrics();
        (0, globals_1.expect)(result).toBe(mockMetrics);
        (0, globals_1.expect)(metricsService.getMetrics).toHaveBeenCalled();
    });
});
//# sourceMappingURL=metrics.controller.spec.js.map