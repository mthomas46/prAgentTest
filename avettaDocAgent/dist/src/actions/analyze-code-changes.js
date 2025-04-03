"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCodeChanges = void 0;
const spinai_1 = require("spinai");
const openai_1 = require("@ai-sdk/openai");
const ai_1 = require("ai");
const zod_1 = require("zod");
const AnalysisResultSchema = zod_1.z.object({
    line: zod_1.z.number(),
    comment: zod_1.z.string(),
});
const AnalysisResponseSchema = zod_1.z.object({
    results: zod_1.z.array(AnalysisResultSchema),
});
exports.analyzeCodeChanges = (0, spinai_1.createAction)({
    id: "analyze_code_changes",
    description: "Analyzes code changes in a PR and provides meaningful review comments.",
    parameters: {
        type: "object",
        properties: {
            filename: {
                type: "string",
                description: "Name of the file being analyzed",
            },
            patch: {
                type: "string",
                description: "Git patch data showing the changes",
            },
            status: {
                type: "string",
                description: "Status of the file (added, modified, removed)",
            },
            changes: {
                type: "number",
                description: "Total number of lines changed",
            },
            additions: {
                type: "number",
                description: "Number of lines added",
            },
            deletions: {
                type: "number",
                description: "Number of lines deleted",
            },
        },
        required: ["filename", "patch", "status"],
    },
    async run({ parameters }) {
        if (!parameters ||
            typeof parameters.filename !== "string" ||
            typeof parameters.patch !== "string" ||
            typeof parameters.status !== "string") {
            throw new Error("Invalid parameters: filename, patch, and status are required");
        }
        const { filename, patch, status } = parameters;
        const prompt = `You are a pragmatic code reviewer. Analyze the following code changes and identify only significant issues that need attention.
Focus on real problems that need fixing, such as:
- Actual security vulnerabilities
- Clear bugs or errors
- Important missing error handling
- API misuse

Don't report:
- Style issues
- Minor optimizations
- Hypothetical problems
- Nitpicks

File: ${filename}
Status: ${status}

Git Patch:
\`\`\`diff
${patch}
\`\`\`

For each significant issue found, provide:
- The line number (referring to the new line numbers in the patch, marked with +)
- A brief, specific comment starting with 🤖 that explains the actual problem

Remember: Only report real issues that need fixing. Quality over quantity. Only point out real issues, no nitpicking`;
        const { object } = await (0, ai_1.generateObject)({
            model: (0, openai_1.openai)("gpt-4"),
            prompt,
            schema: AnalysisResponseSchema,
        });
        return object.results;
    },
});
//# sourceMappingURL=analyze-code-changes.js.map