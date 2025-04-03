export declare class WebhookController {
    healthCheck(): {
        status: string;
    };
    handleWebhook(event: string, payload: any): Promise<{
        status: string;
    }>;
}
