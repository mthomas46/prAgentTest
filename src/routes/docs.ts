import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { marked } from 'marked';

export const docsRouter = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const docsPath = join(__dirname, '../../docs');

docsRouter.get('/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = join(docsPath, filename);
    const content = readFileSync(filePath, 'utf-8');
    const html = marked(content);
    res.send(html);
  } catch (error) {
    res.status(404).json({ error: 'Documentation file not found' });
  }
}); 