"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const health_controller_1 = require("./health.controller");
const metrics_service_1 = require("./metrics.service");
const globals_1 = require("@jest/globals");
globals_1.jest.mock('./metrics.service');
(0, globals_1.describe)('HealthController', () => {
    let controller;
    let metricsService;
    (0, globals_1.beforeEach)(() => {
        metricsService = new metrics_service_1.MetricsService();
        controller = new health_controller_1.HealthController(metricsService);
    });
    (0, globals_1.it)('should be defined', () => {
        (0, globals_1.expect)(controller).toBeDefined();
    });
    (0, globals_1.it)('should return health status', () => {
        const result = controller.check();
        (0, globals_1.expect)(result).toEqual({
            status: 'ok',
            timestamp: globals_1.expect.any(String)
        });
        (0, globals_1.expect)(metricsService.incrementRequest).toHaveBeenCalledWith('GET', '/health', 200);
    });
});
//# sourceMappingURL=health.controller.spec.js.map