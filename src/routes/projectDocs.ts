import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { renderMarkdown } from '../utils/markdownRenderer.js';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// List of allowed project documentation files
const allowedFiles = ['README', 'CHANGELOG', 'DIALOGUE_LOG', 'STATISTICS'];

/**
 * @swagger
 * /api/project-docs/{filename}:
 *   get:
 *     summary: Get project documentation file
 *     description: Returns project documentation in either Markdown or HTML format based on Accept header
 *     tags: [Project Documentation]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *           enum: [README, CHANGELOG, DIALOGUE_LOG, STATISTICS]
 *         description: Name of the project documentation file to retrieve
 *     responses:
 *       200:
 *         description: Project documentation content
 *         content:
 *           text/markdown:
 *             schema:
 *               type: string
 *           text/html:
 *             schema:
 *               type: string
 *       403:
 *         description: Access to the requested file is not allowed
 *       404:
 *         description: Documentation file not found
 */
router.get('/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        
        // Check if the requested file is allowed
        if (!allowedFiles.includes(filename)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Access to this documentation file is not allowed'
            });
        }

        const filePath = path.join(__dirname, '..', '..', 'docs', `${filename}.md`);
        
        // Read the markdown file
        const markdown = await fs.readFile(filePath, 'utf-8');
        
        // Check if the client accepts HTML
        const acceptsHtml = req.accepts(['text/html', 'text/markdown']) === 'text/html';
        
        if (acceptsHtml) {
            // Render markdown to HTML
            const html = renderMarkdown(markdown);
            res.send(html);
        } else {
            // Send raw markdown
            res.type('text/markdown').send(markdown);
        }
    } catch (error) {
        console.error('Error serving project documentation:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to serve project documentation'
        });
    }
});

export default router; 