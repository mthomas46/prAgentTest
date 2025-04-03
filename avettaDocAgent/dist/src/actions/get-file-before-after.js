"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileBeforeAfter = void 0;
const spinai_1 = require("spinai");
const rest_1 = require("@octokit/rest");
exports.getFileBeforeAfter = (0, spinai_1.createAction)({
    id: "get_file_before_after",
    description: "Gets the before and after content of files changed in a GitHub Pull Request.",
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
        const { prUrl } = parameters;
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
            const { data: files } = await octokit.pulls.listFiles({
                owner,
                repo,
                pull_number: parseInt(pullNumber),
            });
            const fileChanges = await Promise.all(files.map(async (file) => {
                let beforeContent = null;
                let afterContent = null;
                if (file.status !== "removed") {
                    try {
                        const { data: headContent } = await octokit.repos.getContent({
                            owner,
                            repo,
                            path: file.filename,
                            ref: pr.head.sha,
                        });
                        if ("content" in headContent &&
                            typeof headContent.content === "string") {
                            afterContent = Buffer.from(headContent.content, "base64").toString();
                        }
                    }
                    catch (error) {
                        console.error(`Error fetching head content for ${file.filename}:`, error);
                    }
                }
                if (file.status !== "added") {
                    try {
                        const { data: baseContent } = await octokit.repos.getContent({
                            owner,
                            repo,
                            path: file.filename,
                            ref: pr.base.sha,
                        });
                        if ("content" in baseContent &&
                            typeof baseContent.content === "string") {
                            beforeContent = Buffer.from(baseContent.content, "base64").toString();
                        }
                    }
                    catch (error) {
                        console.error(`Error fetching base content for ${file.filename}:`, error);
                    }
                }
                return {
                    filename: file.filename,
                    before_content: beforeContent,
                    after_content: afterContent,
                };
            }));
            return fileChanges;
        }
        catch (error) {
            throw new Error(`Failed to fetch PR file contents: ${error}`);
        }
    },
});
//# sourceMappingURL=get-file-before-after.js.map