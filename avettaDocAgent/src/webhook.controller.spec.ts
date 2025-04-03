import { WebhookController } from './webhook.controller';
import { handleNewPullRequest, handleIssueComment, handleReviewComment } from './pr-handlers';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';

// Mock the PR handlers
jest.mock('./pr-handlers', () => ({
  handleNewPullRequest: jest.fn(),
  handleIssueComment: jest.fn(),
  handleReviewComment: jest.fn()
}));

describe('WebhookController', () => {
  let controller: WebhookController;

  beforeEach(() => {
    controller = new WebhookController();
    jest.clearAllMocks();
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const result = controller.healthCheck();
      expect(result).toEqual({ status: 'GitHub PR Review Bot is running' });
    });
  });

  describe('handleWebhook', () => {
    it('should handle pull request opened event', async () => {
      const event = 'pull_request';
      const payload = {
        action: 'opened',
        pull_request: {
          number: 123,
          title: 'Test PR'
        }
      };

      await controller.handleWebhook(event, payload);
      expect(handleNewPullRequest).toHaveBeenCalledWith(payload);
    });

    it('should handle pull request synchronized event', async () => {
      const event = 'pull_request';
      const payload = {
        action: 'synchronize',
        pull_request: {
          number: 123,
          title: 'Test PR'
        }
      };

      await controller.handleWebhook(event, payload);
      expect(handleNewPullRequest).toHaveBeenCalledWith(payload);
    });

    it('should handle issue comment event', async () => {
      const event = 'issue_comment';
      const payload = {
        action: 'created',
        comment: {
          body: 'Test comment'
        }
      };

      await controller.handleWebhook(event, payload);
      expect(handleIssueComment).toHaveBeenCalledWith(payload);
    });

    it('should handle review comment event', async () => {
      const event = 'pull_request_review_comment';
      const payload = {
        action: 'created',
        comment: {
          body: 'Test review comment'
        }
      };

      await controller.handleWebhook(event, payload);
      expect(handleReviewComment).toHaveBeenCalledWith(payload);
    });

    it('should ignore bot comments', async () => {
      const event = 'issue_comment';
      const payload = {
        action: 'created',
        comment: {
          body: '🤖 Bot comment'
        }
      };

      await controller.handleWebhook(event, payload);
      expect(handleIssueComment).not.toHaveBeenCalled();
    });

    it('should handle missing event header', async () => {
      const event = '';
      const payload = {};

      await expect(controller.handleWebhook(event, payload)).rejects.toThrow('Missing X-GitHub-Event header');
    });

    it('should handle unsupported events', async () => {
      const event = 'unsupported_event';
      const payload = {};

      await controller.handleWebhook(event, payload);
      expect(handleNewPullRequest).not.toHaveBeenCalled();
      expect(handleIssueComment).not.toHaveBeenCalled();
      expect(handleReviewComment).not.toHaveBeenCalled();
    });

    it('should handle unsupported actions', async () => {
      const event = 'pull_request';
      const payload = {
        action: 'closed'
      };

      await controller.handleWebhook(event, payload);
      expect(handleNewPullRequest).not.toHaveBeenCalled();
    });

    it('should handle handler errors', async () => {
      const event = 'pull_request';
      const payload = {
        action: 'opened'
      };

      (handleNewPullRequest as jest.Mock).mockRejectedValue(new Error('Handler error') as unknown as never);

      await expect(controller.handleWebhook(event, payload)).rejects.toThrow('Internal server error');
    });
  });
}); 