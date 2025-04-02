import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { renderMarkdown } from '../utils/markdownRenderer.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of allowed documentation files
const allowedFiles = [
    'docs.md',
    'api.md',
    'health.md',
    'docs.html',
    'index.html',
    'api.html',
    'health.html',
    'template.html'
] as const;

// Middleware to check if the requested file is allowed
const checkAllowedFile = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const requestedFile = req.params.filename;
    if (!allowedFiles.includes(requestedFile as typeof allowedFiles[number])) {
        res.status(403).json({ error: 'Access to this file is not allowed' });
        return;
    }
    next();
};

// Route to serve documentation files
router.get('/:filename', checkAllowedFile, async (req: Request, res: Response): Promise<void> => {
    const filename = req.params.filename;
    
    try {
        // Handle Markdown files
        if (filename.endsWith('.md')) {
            const filePath = path.join(__dirname, '..', 'public', 'docs', filename);
            const markdown = readFileSync(filePath, 'utf-8');
            const html = await renderMarkdown(markdown);
            
            // Read the template
            const templatePath = path.join(__dirname, '..', 'public', 'docs', 'template.html');
            let template = readFileSync(templatePath, 'utf-8');
            
            // Replace placeholders
            template = template
                .replace('{{title}}', filename.replace('.md', ''))
                .replace('{{content}}', html);
            
            // Add active class to current page link
            template = template.replace(
                `href="/docs/${filename}"`,
                `href="/docs/${filename}" class="nav-link active"`
            );
            
            res.send(template);
        } else {
            // Handle HTML files
            const filePath = path.join(__dirname, '..', 'public', filename);
            res.sendFile(filePath);
        }
    } catch (error) {
        console.error('Error serving file:', error);
        res.status(404).json({ error: 'Documentation file not found' });
    }
});

export const docsRouter = router; 