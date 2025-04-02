import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked with highlight.js
marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: (code: string, lang: string): string => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {
                console.error('Error highlighting code:', err);
            }
        }
        return code;
    }
} as Parameters<typeof marked.setOptions>[0]);

/**
 * Renders markdown content to HTML with syntax highlighting
 * @param markdown - The markdown content to render
 * @returns Promise<string> - The rendered HTML content
 */
export const renderMarkdown = async (markdown: string): Promise<string> => {
    try {
        const result = await marked(markdown);
        return result;
    } catch (error) {
        console.error('Error rendering markdown:', error);
        throw error;
    }
}; 