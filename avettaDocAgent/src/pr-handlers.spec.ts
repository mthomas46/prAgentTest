import { handleNewPullRequest, handleIssueComment, handleReviewComment } from './pr-handlers';
import { getPRReviewAgent } from './github-agent';
import { CodeReviewSchema, CommentResponseSchema } from './schemas';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';

// Mock the GitHub agent
jest.mock('./github-agent', () => ({
  getPRReviewAgent: jest.fn()
}));

describe('PR Handlers', () => {
  let mockAgent: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore - Mock implementation
    mockAgent = jest.fn().mockResolvedValue({ success: true });
    // @ts-ignore - Mock implementation
    (getPRReviewAgent as jest.Mock).mockResolvedValue(mockAgent);
  });

  describe('handleNewPullRequest', () => {
    it('should handle new pull request', async () => {
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

      const result = await handleNewPullRequest(payload);
      expect(result).toBe(true);
      expect(mockAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.stringContaining('Review pull request #123'),
          responseFormat: CodeReviewSchema
        })
      );
    });

    it('should handle errors gracefully', async () => {
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

      const result = await handleNewPullRequest(payload);
      expect(result).toBe(false);
    });
  });

  describe('handleIssueComment', () => {
    it.skip('should handle comment on PR', async () => {
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

      const result = await handleIssueComment(payload);
      expect(result).toBe(true);
      expect(mockAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.stringContaining('Respond to this comment on PR #123'),
          responseFormat: CommentResponseSchema
        })
      );
    });

    it('should ignore comments on regular issues', async () => {
      const payload = {
        repository: {
          owner: { login: 'test-owner' },
          name: 'test-repo'
        },
        issue: {
          number: 123
          // No pull_request field
        },
        comment: {
          body: 'Test comment'
        }
      };

      const result = await handleIssueComment(payload);
      expect(result).toBe(false);
      expect(mockAgent).not.toHaveBeenCalled();
    });

    it('should ignore bot comments', async () => {
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

      const result = await handleIssueComment(payload);
      expect(result).toBe(false);
      expect(mockAgent).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
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

      const result = await handleIssueComment(payload);
      expect(result).toBe(false);
    });
  });

  describe('handleReviewComment', () => {
    it('should handle review comment', async () => {
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

      const result = await handleReviewComment(payload);
      expect(result).toBe(true);
      expect(mockAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.stringContaining('Respond to this code review comment on PR #123'),
          responseFormat: CommentResponseSchema
        })
      );
    });

    it('should ignore bot comments', async () => {
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

      const result = await handleReviewComment(payload);
      expect(result).toBe(false);
      expect(mockAgent).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
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

      const result = await handleReviewComment(payload);
      expect(result).toBe(false);
    });
  });
}); 