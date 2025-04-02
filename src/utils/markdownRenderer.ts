import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

// Create markdown-it instance with configuration
const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    highlight: (str: string, lang: string): string => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code class="language-${lang}">${
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
                }</code></pre>`;
            } catch (error) {
                console.error('Error highlighting code:', error);
            }
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
});

/**
 * Renders markdown content to HTML with syntax highlighting
 * @param markdown - The markdown content to render
 * @returns string - The rendered HTML content
 */
export function renderMarkdown(markdown: string): string {
    return md.render(markdown);
} 