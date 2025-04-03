import { getPRReviewAgent, createPRReviewAgent } from './github-agent';
import { createAgent } from 'spinai';

// Mock the spinai module
jest.mock('spinai', () => ({
  createAgent: jest.fn(),
  createActionsFromMcpConfig: jest.fn().mockResolvedValue([])
}));

// Mock the openai module
jest.mock('@ai-sdk/openai', () => ({
  openai: jest.fn()
}));

// Mock the actions
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
  let mockAgent: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock agent
    mockAgent = {
      run: jest.fn()
    };
    (createAgent as jest.Mock).mockReturnValue(mockAgent);
  });

  describe('getPRReviewAgent', () => {
    it('should create and return the agent', async () => {
      const agent = await getPRReviewAgent();
      expect(agent).toBe(mockAgent);
      expect(createAgent).toHaveBeenCalledTimes(1);
    });

    it.skip('should reuse the same agent instance', async () => {
      const agent1 = await getPRReviewAgent();
      const agent2 = await getPRReviewAgent();
      expect(agent1).toBe(agent2);
      expect(createAgent).toHaveBeenCalledTimes(1);
    });
  });

  describe('createPRReviewAgent', () => {
    it('should create an agent with the correct configuration', async () => {
      const agent = await createPRReviewAgent();
      expect(agent).toBe(mockAgent);
      expect(createAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          instructions: expect.stringContaining('GitHub assistant'),
          agentId: 'github-pr-review-agent'
        })
      );
    });

    it('should include required GitHub actions', async () => {
      await createPRReviewAgent();
      expect(createAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({ name: 'analyzeCodeChanges' }),
            expect.objectContaining({ name: 'createReviewComments' }),
            expect.objectContaining({ name: 'getFileBeforeAfter' }),
            expect.objectContaining({ name: 'getPrFiles' })
          ])
        })
      );
    });
  });
}); 