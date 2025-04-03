import { CodeReviewSchema, CommentResponseSchema } from './schemas';

describe('Schemas', () => {
  describe('CodeReviewSchema', () => {
    it('should validate valid code review response', () => {
      const validResponse = {
        review: {
          summary: 'This PR looks good overall',
          keyPoints: ['Added new feature', 'Fixed bug'],
          commentCount: 2
        },
        status: 'completed'
      };

      const result = CodeReviewSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should reject response without summary', () => {
      const invalidResponse = {
        review: {
          keyPoints: ['Added new feature'],
          commentCount: 1
        },
        status: 'completed'
      };

      const result = CodeReviewSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const invalidResponse = {
        review: {
          summary: 'This PR looks good',
          keyPoints: ['Added feature'],
          commentCount: 0
        },
        status: 'invalid_status'
      };

      const result = CodeReviewSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should accept empty keyPoints array', () => {
      const validResponse = {
        review: {
          summary: 'This PR looks good',
          keyPoints: [],
          commentCount: 0
        },
        status: 'completed'
      };

      const result = CodeReviewSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('CommentResponseSchema', () => {
    it('should validate valid comment response', () => {
      const validResponse = {
        response: 'This is a good suggestion'
      };

      const result = CommentResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should reject response without response field', () => {
      const invalidResponse = {
        // Missing response field
      };

      const result = CommentResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject empty response', () => {
      const invalidResponse = {
        response: ''
      };

      const result = CommentResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should handle long responses', () => {
      const validResponse = {
        response: 'A'.repeat(1000) // Long response
      };

      const result = CommentResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });
}); 