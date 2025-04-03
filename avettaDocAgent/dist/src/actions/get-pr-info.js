"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrFiles = void 0;
const spinai_1 = require("spinai");
const rest_1 = require("@octokit/rest");
exports.getPrFiles = (0, spinai_1.createAction)({
    id: "getPrFiles",
    description: "Gets the list of files changed in a GitHub Pull Request.",
    parameters: {
        type: "object",
        properties: {
            prUrl: {
                type: "string",
                description: "Full URL of the GitHub PR (e.g., https://github.com/owner/repo/pull/number)",
            },
        },
        required: ["prUrl"],
    },
    async run({ parameters }) {
        const { prUrl } = parameters || {};
        if (!prUrl || typeof prUrl !== "string") {
            throw new Error(`Missing required parameter: prUrl / wrong format ${prUrl}`);
        }
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
            const { data: files } = await octokit.pulls.listFiles({
                owner,
                repo,
                pull_number: parseInt(pullNumber),
            });
            return files.map((file) => ({
                filename: file.filename,
                status: file.status,
                additions: file.additions,
                deletions: file.deletions,
                changes: file.changes,
                patch: file.patch,
            }));
        }
        catch (error) {
            throw new Error(`Failed to fetch PR files: ${error}`);
        }
    },
});
//# sourceMappingURL=get-pr-info.js.map