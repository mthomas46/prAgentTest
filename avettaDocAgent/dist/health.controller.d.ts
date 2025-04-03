import { MetricsService } from './metrics.service';
export declare class HealthController {
    private readonly metricsService;
    constructor(metricsService: MetricsService);
    check(): {
        status: string;
        timestamp: string;
    };
}
