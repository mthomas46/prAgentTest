"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewComments = void 0;
const spinai_1 = require("spinai");
const rest_1 = require("@octokit/rest");
function isReviewComment(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        "line" in obj &&
        typeof obj.line === "number" &&
        "comment" in obj &&
        typeof obj.comment === "string");
}
function validateParameters(params) {
    if (typeof params.prUrl !== "string" ||
        typeof params.filename !== "string" ||
        !Array.isArray(params.comments) ||
        !params.comments.every(isReviewComment)) {
        throw new Error("Invalid parameters: prUrl, filename must be strings and comments must be an array of ReviewComments");
    }
    return {
        prUrl: params.prUrl,
        filename: params.filename,
        comments: params.comments,
    };
}
exports.createReviewComments = (0, spinai_1.createAction)({
    id: "create_review_comments",
    description: "Creates review comments on a GitHub Pull Request",
    parameters: {
        type: "object",
        properties: {
            prUrl: {
                type: "string",
                description: "Full URL of the GitHub PR (e.g., https://github.com/owner/repo/pull/number)",
            },
            filename: {
                type: "string",
                description: "Name of the file to comment on",
            },
            comments: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        line: { type: "number" },
                        comment: { type: "string" },
                    },
                    required: ["line", "comment"],
                },
                description: "Array of comments with line numbers",
            },
        },
        required: ["prUrl", "filename", "comments"],
    },
    async run({ parameters }) {
        if (!parameters || typeof parameters !== "object") {
            throw new Error("Parameters are required");
        }
        const { prUrl, filename, comments } = validateParameters(parameters);
        const prUrlRegex = /github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/;
        const match = prUrl.match(prUrlRegex);
        if (!match) {
            throw new Error("Invalid GitHub PR URL format");
        }
        const [, owner, repo, pullNumber] = match;
        const octokit = new rest_1.Octokit({
            auth: process.env.GITHUB_TOKEN,
        });
        try {
            const { data: pr } = await octokit.pulls.get({
                owner,
                repo,
                pull_number: parseInt(pullNumber),
            });
            const commitId = pr.head.sha;
            const review = await octokit.pulls.createReview({
                owner,
                repo,
                pull_number: parseInt(pullNumber),
                commit_id: commitId,
                event: "COMMENT",
                comments: comments.map((comment) => ({
                    path: filename,
                    line: comment.line,
                    body: comment.comment,
                    side: "RIGHT",
                })),
            });
            return {
                reviewId: review.data.id,
                commentCount: comments.length,
            };
        }
        catch (error) {
            throw new Error(`Failed to create review comments: ${error}`);
        }
    },
});
//# sourceMappingURL=create-review-comments.js.map