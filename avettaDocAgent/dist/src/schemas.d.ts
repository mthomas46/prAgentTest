import { z } from "zod";
export declare const CodeReviewSchema: z.ZodObject<{
    review: z.ZodObject<{
        summary: z.ZodString;
        keyPoints: z.ZodArray<z.ZodString, "many">;
        commentCount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        summary?: string;
        keyPoints?: string[];
        commentCount?: number;
    }, {
        summary?: string;
        keyPoints?: string[];
        commentCount?: number;
    }>;
    status: z.ZodEnum<["completed", "commented", "changes_requested", "approved"]>;
}, "strip", z.ZodTypeAny, {
    status?: "completed" | "commented" | "changes_requested" | "approved";
    review?: {
        summary?: string;
        keyPoints?: string[];
        commentCount?: number;
    };
}, {
    status?: "completed" | "commented" | "changes_requested" | "approved";
    review?: {
        summary?: string;
        keyPoints?: string[];
        commentCount?: number;
    };
}>;
export declare const CommentResponseSchema: z.ZodObject<{
    response: z.ZodString;
}, "strip", z.ZodTypeAny, {
    response?: string;
}, {
    response?: string;
}>;
