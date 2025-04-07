module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,js}': [
    // Format code
    'prettier --write',
    // Fix linting issues
    'eslint --fix',
    // Type check only staged files
    () => 'tsc --noEmit',
    // Run tests related to staged files
    'jest --bail --findRelatedTests'
  ],
  
  // JSON and Markdown files
  '*.{json,md}': [
    'prettier --write'
  ],
  
  // YAML files
  '*.{yml,yaml}': [
    'prettier --write'
  ],
  
  // CSS and SCSS files
  '*.{css,scss}': [
    'prettier --write'
  ],
  
  // Prevent committing sensitive files
  '*': [
    (files) => {
      const sensitiveFiles = files.filter(file => 
        /\.(env|key|secret|pem)$/.test(file)
      );
      if (sensitiveFiles.length > 0) {
        console.error('Error: Attempting to commit sensitive files:', sensitiveFiles.join(', '));
        return false;
      }
      return true;
    }
  ]
}; 