"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNewPullRequest = handleNewPullRequest;
exports.handleIssueComment = handleIssueComment;
exports.handleReviewComment = handleReviewComment;
const github_agent_1 = require("./github-agent");
const schemas_1 = require("./schemas");
const BOT_COMMENT_MARKER = "🤖 ";
async function handleNewPullRequest(payload) {
    const { repository, pull_request } = payload;
    const owner = repository.owner.login;
    const repo = repository.name;
    const pullNumber = pull_request.number;
    console.log(`Reviewing PR #${pullNumber} in ${owner}/${repo}`);
    try {
        const agent = await (0, github_agent_1.getPRReviewAgent)();
        const result = await agent({
            input: `Review pull request #${pullNumber} in repo ${owner}/${repo} by leaving comments on specific files in the pr.
      
      After, create an overview of the overall issue (PR) with what you've done..`,
            responseFormat: schemas_1.CodeReviewSchema,
        });
        console.log(`Review with line comments completed for PR #${pullNumber}`);
        return true;
    }
    catch (error) {
        console.log(`Error reviewing PR #${pullNumber}:`, error);
        return false;
    }
}
async function handleIssueComment(payload) {
    const { repository, issue, comment } = payload;
    if (!issue.pull_request) {
        return false;
    }
    if (!shouldRespondToComment(comment.body)) {
        return false;
    }
    const owner = repository.owner.login;
    const repo = repository.name;
    const prNumber = issue.number;
    console.log(`Responding to comment on PR #${prNumber}`);
    try {
        const agent = await (0, github_agent_1.getPRReviewAgent)();
        const result = await agent({
            input: `Respond to this comment on PR #${prNumber} in ${owner}/${repo}:
              
              Comment: ${comment.body}
              Comment Author: ${comment.user.login}
              
              1. Generate a brief, helpful response that addresses the comment directly
              2. Post your response as a comment on the PR
              3. Be concise and focused on addressing the specific points in the comment
              
              IMPORTANT: Your comment MUST start with this exact emoji: ${BOT_COMMENT_MARKER}`,
            responseFormat: schemas_1.CommentResponseSchema,
        });
        console.log(`Response generated and posted to comment on PR #${prNumber}`);
        return true;
    }
    catch (error) {
        console.log(`Error responding to comment on PR #${prNumber}:`, error);
        return false;
    }
}
async function handleReviewComment(payload) {
    var _a;
    const { repository, pull_request, comment } = payload;
    if (!shouldRespondToComment(comment.body)) {
        return false;
    }
    const owner = repository.owner.login;
    const repo = repository.name;
    const prNumber = pull_request.number;
    const filePath = comment.path;
    const linePosition = comment.position || "N/A";
    console.log(`Responding to review comment on file ${filePath}`);
    try {
        const agent = await (0, github_agent_1.getPRReviewAgent)();
        const result = await agent({
            input: `Respond to this code review comment on PR #${prNumber} in ${owner}/${repo}:
              
              Comment: ${comment.body}
              Comment Author: ${((_a = comment.user) === null || _a === void 0 ? void 0 : _a.login) || 'Unknown User'}
              File: ${filePath}
              Line: ${linePosition}
              
              Follow these steps:
              1. Get the content of the file focusing on the relevant code
              2. Generate a brief, technical response addressing the comment
              3. Include code examples if appropriate
              4. Post your response as a comment on this PR
              
              IMPORTANT: Your comment MUST start with this exact emoji: ${BOT_COMMENT_MARKER}
              
              Your response should be concise, helpful, and address the specific points in the comment.`,
            responseFormat: schemas_1.CommentResponseSchema,
        });
        console.log(`Response generated and posted to review comment`);
        return true;
    }
    catch (error) {
        console.log(`Error responding to review comment:`, error);
        return false;
    }
}
function shouldRespondToComment(commentBody) {
    if (commentBody.trim().startsWith(BOT_COMMENT_MARKER)) {
        return false;
    }
    const botName = process.env.BOT_USERNAME || "github-bot";
    const triggers = [
        `@${botName}`,
        "bot",
        "ai",
        "review",
        "help",
        "explain",
        "what do you think",
        "can you suggest",
    ];
    const lowerComment = commentBody.toLowerCase();
    return triggers.some((trigger) => lowerComment.includes(trigger.toLowerCase()));
}
//# sourceMappingURL=pr-handlers.js.map