export declare class MetricsService {
    private metrics;
    private requestCounts;
    incrementRequest(method: string, path: string, statusCode: number): void;
    getMetrics(): string;
}
