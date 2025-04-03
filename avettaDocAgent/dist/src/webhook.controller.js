"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const pr_handlers_1 = require("./pr-handlers");
let WebhookController = class WebhookController {
    healthCheck() {
        return { status: 'GitHub PR Review Bot is running' };
    }
    async handleWebhook(event, payload) {
        var _a, _b, _c, _d;
        try {
            if (!event) {
                throw new common_1.HttpException('Missing X-GitHub-Event header', common_1.HttpStatus.BAD_REQUEST);
            }
            console.log(`Received ${event} event`);
            switch (event) {
                case 'pull_request':
                    if (payload.action === 'opened' || payload.action === 'synchronize') {
                        await (0, pr_handlers_1.handleNewPullRequest)(payload);
                    }
                    break;
                case 'issue_comment':
                    if (payload.action === 'created' &&
                        !((_b = (_a = payload.comment) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.startsWith('🤖 '))) {
                        await (0, pr_handlers_1.handleIssueComment)(payload);
                    }
                    break;
                case 'pull_request_review_comment':
                    if (payload.action === 'created' &&
                        !((_d = (_c = payload.comment) === null || _c === void 0 ? void 0 : _c.body) === null || _d === void 0 ? void 0 : _d.startsWith('🤖 '))) {
                        await (0, pr_handlers_1.handleReviewComment)(payload);
                    }
                    break;
            }
            return { status: 'success' };
        }
        catch (error) {
            console.error('Error processing webhook:', error);
            if (error instanceof common_1.HttpException && error.message === 'Missing X-GitHub-Event header') {
                throw error;
            }
            throw new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('x-github-event')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleWebhook", null);
exports.WebhookController = WebhookController = __decorate([
    (0, common_1.Controller)('webhook')
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map