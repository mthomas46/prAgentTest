"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github_agent_1 = require("./github-agent");
const spinai_1 = require("spinai");
jest.mock('spinai', () => ({
    createAgent: jest.fn(),
    createActionsFromMcpConfig: jest.fn().mockResolvedValue([])
}));
jest.mock('@ai-sdk/openai', () => ({
    openai: jest.fn()
}));
jest.mock('./actions/analyze-code-changes.js', () => ({
    analyzeCodeChanges: { name: 'analyzeCodeChanges' }
}));
jest.mock('./actions/create-review-comments.js', () => ({
    createReviewComments: { name: 'createReviewComments' }
}));
jest.mock('./actions/get-file-before-after.js', () => ({
    getFileBeforeAfter: { name: 'getFileBeforeAfter' }
}));
jest.mock('./actions/get-pr-info.js', () => ({
    getPrFiles: { name: 'getPrFiles' }
}));
describe('GitHub Agent', () => {
    let mockAgent;
    beforeEach(() => {
        jest.clearAllMocks();
        mockAgent = {
            run: jest.fn()
        };
        spinai_1.createAgent.mockReturnValue(mockAgent);
    });
    describe('getPRReviewAgent', () => {
        it('should create and return the agent', async () => {
            const agent = await (0, github_agent_1.getPRReviewAgent)();
            expect(agent).toBe(mockAgent);
            expect(spinai_1.createAgent).toHaveBeenCalledTimes(1);
        });
        it.skip('should reuse the same agent instance', async () => {
            const agent1 = await (0, github_agent_1.getPRReviewAgent)();
            const agent2 = await (0, github_agent_1.getPRReviewAgent)();
            expect(agent1).toBe(agent2);
            expect(spinai_1.createAgent).toHaveBeenCalledTimes(1);
        });
    });
    describe('createPRReviewAgent', () => {
        it('should create an agent with the correct configuration', async () => {
            const agent = await (0, github_agent_1.createPRReviewAgent)();
            expect(agent).toBe(mockAgent);
            expect(spinai_1.createAgent).toHaveBeenCalledWith(expect.objectContaining({
                instructions: expect.stringContaining('GitHub assistant'),
                agentId: 'github-pr-review-agent'
            }));
        });
        it('should include required GitHub actions', async () => {
            await (0, github_agent_1.createPRReviewAgent)();
            expect(spinai_1.createAgent).toHaveBeenCalledWith(expect.objectContaining({
                actions: expect.arrayContaining([
                    expect.objectContaining({ name: 'analyzeCodeChanges' }),
                    expect.objectContaining({ name: 'createReviewComments' }),
                    expect.objectContaining({ name: 'getFileBeforeAfter' }),
                    expect.objectContaining({ name: 'getPrFiles' })
                ])
            }));
        });
    });
});
//# sourceMappingURL=github-agent.spec.js.map