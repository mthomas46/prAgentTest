import { Controller, Get, Post, Headers, Body, HttpException, HttpStatus } from '@nestjs/common';
import { handleNewPullRequest, handleIssueComment, handleReviewComment } from './pr-handlers';

@Controller('webhook')
export class WebhookController {
  @Get()
  healthCheck() {
    return { status: 'GitHub PR Review Bot is running' };
  }

  @Post()
  async handleWebhook(
    @Headers('x-github-event') event: string,
    @Body() payload: any,
  ) {
    try {
      if (!event) {
        throw new HttpException('Missing X-GitHub-Event header', HttpStatus.BAD_REQUEST);
      }

      console.log(`Received ${event} event`);

      // Handle different event types
      switch (event) {
        case 'pull_request':
          if (payload.action === 'opened' || payload.action === 'synchronize') {
            await handleNewPullRequest(payload);
          }
          break;

        case 'issue_comment':
          if (
            payload.action === 'created' &&
            !payload.comment?.body?.startsWith('🤖 ')
          ) {
            await handleIssueComment(payload);
          }
          break;

        case 'pull_request_review_comment':
          if (
            payload.action === 'created' &&
            !payload.comment?.body?.startsWith('🤖 ')
          ) {
            await handleReviewComment(payload);
          }
          break;
      }

      return { status: 'success' };
    } catch (error) {
      console.error('Error processing webhook:', error);
      if (error instanceof HttpException && error.message === 'Missing X-GitHub-Event header') {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 