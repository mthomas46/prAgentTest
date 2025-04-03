"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentResponseSchema = exports.CodeReviewSchema = void 0;
const zod_1 = require("zod");
exports.CodeReviewSchema = zod_1.z.object({
    review: zod_1.z.object({
        summary: zod_1.z.string().describe("Overall assessment of the PR"),
        keyPoints: zod_1.z.array(zod_1.z.string()).describe("Key points about the PR"),
        commentCount: zod_1.z.number().describe("Number of line comments added"),
    }),
    status: zod_1.z
        .enum(["completed", "commented", "changes_requested", "approved"])
        .describe("Status of the review"),
});
exports.CommentResponseSchema = zod_1.z.object({
    response: zod_1.z.string().min(1, "Response cannot be empty").describe("Response to the comment"),
});
//# sourceMappingURL=schemas.js.map