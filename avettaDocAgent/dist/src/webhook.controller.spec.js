"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webhook_controller_1 = require("./webhook.controller");
const pr_handlers_1 = require("./pr-handlers");
const globals_1 = require("@jest/globals");
globals_1.jest.mock('./pr-handlers', () => ({
    handleNewPullRequest: globals_1.jest.fn(),
    handleIssueComment: globals_1.jest.fn(),
    handleReviewComment: globals_1.jest.fn()
}));
(0, globals_1.describe)('WebhookController', () => {
    let controller;
    (0, globals_1.beforeEach)(() => {
        controller = new webhook_controller_1.WebhookController();
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('healthCheck', () => {
        (0, globals_1.it)('should return health status', () => {
            const result = controller.healthCheck();
            (0, globals_1.expect)(result).toEqual({ status: 'GitHub PR Review Bot is running' });
        });
    });
    (0, globals_1.describe)('handleWebhook', () => {
        (0, globals_1.it)('should handle pull request opened event', async () => {
            const event = 'pull_request';
            const payload = {
                action: 'opened',
                pull_request: {
                    number: 123,
                    title: 'Test PR'
                }
            };
            await controller.handleWebhook(event, payload);
            (0, globals_1.expect)(pr_handlers_1.handleNewPullRequest).toHaveBeenCalledWith(payload);
        });
        (0, globals_1.it)('should handle pull request synchronized event', async () => {
            const event = 'pull_request';
            const payload = {
                action: 'synchronize',
                pull_request: {
                    number: 123,
                    title: 'Test PR'
                }
            };
            await controller.handleWebhook(event, payload);
            (0, globals_1.expect)(pr_handlers_1.handleNewPullRequest).toHaveBeenCalledWith(payload);
        });
        (0, globals_1.it)('should handle issue comment event', async () => {
            const event = 'issue_comment';
            const payload = {
                action: 'created',
                comment: {
                    body: 'Test comment'
                }
            };
            await controller.handleWebhook(event, payload);
            (0, globals_1.expect)(pr_handlers_1.handleIssueComment).toHaveBeenCalledWith(payload);
        });
        (0, globals_1.it)('should handle review comment event', async () => {
            const event = 'pull_request_review_comment';
            const payload = {
                action: 'created',
                comment: {
                    body: 'Test review comment'
                }
            };
            await controller.handleWebhook(event, payload);
            (0, globals_1.expect)(pr_handlers_1.handleReviewComment).toHaveBeenCalledWith(payload);
        });
        (0, globals_1.it)('should ignore bot comments', async () => {
            const event = 'issue_comment';
            const payload = {
                action: 'created',
                comment: {
                    body: '🤖 Bot comment'
                }
            };
            await controller.handleWebhook(event, payload);
            (0, globals_1.expect)(pr_handlers_1.handleIssueComment).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('should handle missing event header', async () => {
            const event = '';
            const payload = {};
            await (0, globals_1.expect)(controller.handleWebhook(event, payload)).rejects.toThrow('Missing X-GitHub-Event header');
        });
        (0, globals_1.it)('should handle unsupported events', async () => {
            const event = 'unsupported_event';
            const payload = {};
            await controller.handleWebhook(event, payload);
            (0, globals_1.expect)(pr_handlers_1.handleNewPullRequest).not.toHaveBeenCalled();
            (0, globals_1.expect)(pr_handlers_1.handleIssueComment).not.toHaveBeenCalled();
            (0, globals_1.expect)(pr_handlers_1.handleReviewComment).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('should handle unsupported actions', async () => {
            const event = 'pull_request';
            const payload = {
                action: 'closed'
            };
            await controller.handleWebhook(event, payload);
            (0, globals_1.expect)(pr_handlers_1.handleNewPullRequest).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('should handle handler errors', async () => {
            const event = 'pull_request';
            const payload = {
                action: 'opened'
            };
            pr_handlers_1.handleNewPullRequest.mockRejectedValue(new Error('Handler error'));
            await (0, globals_1.expect)(controller.handleWebhook(event, payload)).rejects.toThrow('Internal server error');
        });
    });
});
//# sourceMappingURL=webhook.controller.spec.js.map