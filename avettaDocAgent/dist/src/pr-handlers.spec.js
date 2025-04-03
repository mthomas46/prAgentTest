"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pr_handlers_1 = require("./pr-handlers");
const github_agent_1 = require("./github-agent");
const schemas_1 = require("./schemas");
const globals_1 = require("@jest/globals");
globals_1.jest.mock('./github-agent', () => ({
    getPRReviewAgent: globals_1.jest.fn()
}));
(0, globals_1.describe)('PR Handlers', () => {
    let mockAgent;
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        mockAgent = globals_1.jest.fn().mockResolvedValue({ success: true });
        github_agent_1.getPRReviewAgent.mockResolvedValue(mockAgent);
    });
    (0, globals_1.describe)('handleNewPullRequest', () => {
        (0, globals_1.it)('should handle new pull request', async () => {
            const payload = {
                repository: {
                    owner: { login: 'test-owner' },
                    name: 'test-repo'
                },
                pull_request: {
                    number: 123
                }
            };
            mockAgent.mockResolvedValueOnce({ success: true });
            const result = await (0, pr_handlers_1.handleNewPullRequest)(payload);
            (0, globals_1.expect)(result).toBe(true);
            (0, globals_1.expect)(mockAgent).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                input: globals_1.expect.stringContaining('Review pull request #123'),
                responseFormat: schemas_1.CodeReviewSchema
            }));
        });
        (0, globals_1.it)('should handle errors gracefully', async () => {
            const payload = {
                repository: {
                    owner: { login: 'test-owner' },
                    name: 'test-repo'
                },
                pull_request: {
                    number: 123
                }
            };
            mockAgent.mockRejectedValueOnce(new Error('Test error'));
            const result = await (0, pr_handlers_1.handleNewPullRequest)(payload);
            (0, globals_1.expect)(result).toBe(false);
        });
    });
    (0, globals_1.describe)('handleIssueComment', () => {
        globals_1.it.skip('should handle comment on PR', async () => {
            const payload = {
                repository: {
                    owner: { login: 'test-owner' },
                    name: 'test-repo'
                },
                issue: {
                    number: 123,
                    pull_request: {}
                },
                comment: {
                    body: 'Test comment',
                    user: { login: 'test-user' }
                }
            };
            mockAgent.mockResolvedValueOnce({ success: true });
            const result = await (0, pr_handlers_1.handleIssueComment)(payload);
            (0, globals_1.expect)(result).toBe(true);
            (0, globals_1.expect)(mockAgent).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                input: globals_1.expect.stringContaining('Respond to this comment on PR #123'),
                responseFormat: schemas_1.CommentResponseSchema
            }));
        });
        (0, globals_1.it)('should ignore comments on regular issues', async () => {
            const payload = {
                repository: {
                    owner: { login: 'test-owner' },
                    name: 'test-repo'
                },
                issue: {
                    number: 123
                },
                comment: {
                    body: 'Test comment'
                }
            };
            const result = await (0, pr_handlers_1.handleIssueComment)(payload);
            (0, globals_1.expect)(result).toBe(false);
            (0, globals_1.expect)(mockAgent).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('should ignore bot comments', async () => {
            const payload = {
                repository: {
                    owner: { login: 'test-owner' },
                    name: 'test-repo'
                },
                issue: {
                    number: 123,
                    pull_request: {}
                },
                comment: {
                    body: '🤖 Bot comment'
                }
            };
            const result = await (0, pr_handlers_1.handleIssueComment)(payload);
            (0, globals_1.expect)(result).toBe(false);
            (0, globals_1.expect)(mockAgent).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('should handle errors gracefully', async () => {
            const payload = {
                repository: {
                    owner: { login: 'test-owner' },
                    name: 'test-repo'
                },
                issue: {
                    number: 123,
                    pull_request: {}
                },
                comment: {
                    body: 'Test comment'
                }
            };
            mockAgent.mockRejectedValueOnce(new Error('Test error'));
            const result = await (0, pr_handlers_1.handleIssueComment)(payload);
            (0, globals_1.expect)(result).toBe(false);
        });
    });
    (0, globals_1.describe)('handleReviewComment', () => {
        (0, globals_1.it)('should handle review comment', async () => {
            const payload = {
                repository: {
                    owner: { login: 'test-owner' },
                    name: 'test-repo'
                },
                pull_request: {
                    number: 123
                },
                comment: {
                    body: 'Test review comment',
                    user: { login: 'test-user' },
                    path: 'test/file.ts',
                    position: 1
                }
            };
            mockAgent.mockResolvedValueOnce({ success: true });
            const result = await (0, pr_handlers_1.handleReviewComment)(payload);
            (0, globals_1.expect)(result).toBe(true);
            (0, globals_1.expect)(mockAgent).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                input: globals_1.expect.stringContaining('Respond to this code review comment on PR #123'),
                responseFormat: schemas_1.CommentResponseSchema
            }));
        });
        (0, globals_1.it)('should ignore bot comments', async () => {
            const payload = {
                repository: {
                    owner: { login: 'test-owner' },
                    name: 'test-repo'
                },
                pull_request: {
                    number: 123
                },
                comment: {
                    body: '🤖 Bot comment'
                }
            };
            const result = await (0, pr_handlers_1.handleReviewComment)(payload);
            (0, globals_1.expect)(result).toBe(false);
            (0, globals_1.expect)(mockAgent).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('should handle errors gracefully', async () => {
            const payload = {
                repository: {
                    owner: { login: 'test-owner' },
                    name: 'test-repo'
                },
                pull_request: {
                    number: 123
                },
                comment: {
                    body: 'Test review comment',
                    user: { login: 'test-user' }
                }
            };
            mockAgent.mockRejectedValueOnce(new Error('Test error'));
            const result = await (0, pr_handlers_1.handleReviewComment)(payload);
            (0, globals_1.expect)(result).toBe(false);
        });
    });
});
//# sourceMappingURL=pr-handlers.spec.js.map