"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
let MetricsService = class MetricsService {
    constructor() {
        this.metrics = new Map();
        this.requestCounts = new Map();
    }
    incrementRequest(method, path, statusCode) {
        const key = `${method}_${path}_${statusCode}`;
        this.requestCounts.set(key, (this.requestCounts.get(key) || 0) + 1);
    }
    getMetrics() {
        let output = '';
        output += '# HELP http_requests_total Total number of HTTP requests\n';
        output += '# TYPE http_requests_total counter\n';
        this.requestCounts.forEach((count, key) => {
            const [method, path, statusCode] = key.split('_');
            output += `http_requests_total{method="${method}",path="${path}",status="${statusCode}"} ${count}\n`;
        });
        return output;
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)()
], MetricsService);
//# sourceMappingURL=metrics.service.js.map