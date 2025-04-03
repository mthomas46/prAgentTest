"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPRReviewAgent = getPRReviewAgent;
exports.createPRReviewAgent = createPRReviewAgent;
const spinai_1 = require("spinai");
const openai_1 = require("@ai-sdk/openai");
const mcp_config_ts_1 = __importDefault(require("../mcp-config.ts"));
const analyze_code_changes_js_1 = require("./actions/analyze-code-changes.js");
const create_review_comments_js_1 = require("./actions/create-review-comments.js");
const get_file_before_after_js_1 = require("./actions/get-file-before-after.js");
const get_pr_info_js_1 = require("./actions/get-pr-info.js");
async function createPRReviewAgent() {
    console.log("Setting up PR review agent...");
    const mcpActions = await (0, spinai_1.createActionsFromMcpConfig)({
        config: mcp_config_ts_1.default,
        includedActions: [
            "add_issue_comment",
        ],
        envMapping: {
            GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN,
        },
    });
    return (0, spinai_1.createAgent)({
        instructions: `You are a GitHub assistant that can help with repository management.
    Use the available GitHub actions to help users with their requests.`,
        actions: [
            ...(Array.isArray(await mcpActions) ? await mcpActions : []),
            analyze_code_changes_js_1.analyzeCodeChanges,
            create_review_comments_js_1.createReviewComments,
            get_file_before_after_js_1.getFileBeforeAfter,
            get_pr_info_js_1.getPrFiles,
        ],
        model: (0, openai_1.openai)("gpt-4o"),
        spinApiKey: process.env.SPINAI_API_KEY,
        agentId: "github-pr-review-agent",
    });
}
let agentPromise = null;
async function getPRReviewAgent() {
    if (!agentPromise) {
        agentPromise = createPRReviewAgent();
    }
    return await agentPromise;
}
//# sourceMappingURL=github-agent.js.map