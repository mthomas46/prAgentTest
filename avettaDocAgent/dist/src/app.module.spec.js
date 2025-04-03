"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("./app.module");
const webhook_controller_1 = require("./webhook.controller");
const health_controller_1 = require("./health.controller");
const metrics_controller_1 = require("./metrics.controller");
const metrics_service_1 = require("./metrics.service");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)('AppModule', () => {
    let module;
    beforeEach(async () => {
        module = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
    });
    (0, globals_1.it)('should be defined', () => {
        (0, globals_1.expect)(module).toBeDefined();
    });
    (0, globals_1.it)('should have WebhookController', () => {
        const controller = module.get(webhook_controller_1.WebhookController);
        (0, globals_1.expect)(controller).toBeDefined();
        (0, globals_1.expect)(controller).toBeInstanceOf(webhook_controller_1.WebhookController);
    });
    (0, globals_1.it)('should have HealthController', () => {
        const controller = module.get(health_controller_1.HealthController);
        (0, globals_1.expect)(controller).toBeDefined();
        (0, globals_1.expect)(controller).toBeInstanceOf(health_controller_1.HealthController);
    });
    (0, globals_1.it)('should have MetricsController', () => {
        const controller = module.get(metrics_controller_1.MetricsController);
        (0, globals_1.expect)(controller).toBeDefined();
        (0, globals_1.expect)(controller).toBeInstanceOf(metrics_controller_1.MetricsController);
    });
    (0, globals_1.it)('should have MetricsService', () => {
        const service = module.get(metrics_service_1.MetricsService);
        (0, globals_1.expect)(service).toBeDefined();
        (0, globals_1.expect)(service).toBeInstanceOf(metrics_service_1.MetricsService);
    });
});
//# sourceMappingURL=app.module.spec.js.map