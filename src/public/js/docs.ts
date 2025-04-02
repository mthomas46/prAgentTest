"use strict";
// Type declarations
declare module 'marked' {
    export function parse(text: string): string;
    export function setOptions(options: {
        gfm?: boolean;
        breaks?: boolean;
        pedantic?: boolean;
    }): void;
}

// Import marked library
const marked = require('marked');

// Declare initStatistics function type
declare function initStatistics(): void;

// Configure marked options
marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert line breaks to <br>
    pedantic: false, // Don't be too strict
});

// Function to load markdown content
async function loadMarkdownContent(fileName: string): Promise<string> {
    try {
        const response = await fetch(`/docs/${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${fileName}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error loading ${fileName}:`, error);
        return `Error loading ${fileName}. Please try again later.`;
    }
}

// Function to render markdown content using marked
function renderMarkdown(content: string): string {
    try {
        return marked(content);
    } catch (error) {
        console.error('Error rendering markdown:', error);
        return `<div class="error">Error rendering markdown content. Please try again later.</div>`;
    }
}

// Function to update active navigation item
function updateActiveNavItem(activeLink: HTMLAnchorElement): void {
    const navLinks = document.querySelectorAll('.docs-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Function to show loading state
function showLoading(): void {
    const contentContainer = document.querySelector('.docs-content');
    if (contentContainer) {
        contentContainer.innerHTML = '<div class="loading">Loading documentation...</div>';
    }
}

// Function to show error state
function showError(message: string): void {
    const contentContainer = document.querySelector('.docs-content');
    if (contentContainer) {
        contentContainer.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Function to load and display content
async function loadContent(fileName: string): Promise<void> {
    const contentContainer = document.querySelector('.docs-content');
    if (!contentContainer) return;

    try {
        showLoading();
        const content = await loadMarkdownContent(fileName);
        const renderedContent = renderMarkdown(content);
        contentContainer.innerHTML = renderedContent;

        // Initialize statistics if we're on the statistics page
        if (fileName === 'STATISTICS.md' && typeof initStatistics === 'function') {
            initStatistics();
        }
    } catch (error) {
        console.error(`Error loading content for ${fileName}:`, error);
        showError(`Error loading ${fileName}. Please try again later.`);
    }
}

// Consolidated navigation handling
function handleNavigation(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLAnchorElement;
    const fileName = target.getAttribute('data-file');
    const targetId = target.getAttribute('href')?.substring(1);

    if (fileName) {
        // Handle documentation navigation
        updateActiveNavItem(target);
        loadContent(fileName);
    } else if (targetId) {
        // Handle scroll navigation
        updateActiveNavItem(target);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize documentation
async function initDocs(): Promise<void> {
    try {
        // Add click handlers to all navigation links
        const navLinks = document.querySelectorAll<HTMLAnchorElement>('.docs-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavigation);
        });

        // Load initial content based on URL
        const path = window.location.pathname;
        const file = path.split('/').pop();
        
        if (file) {
            const activeLink = document.querySelector(`.docs-nav a[href="/docs/${file}"]`) as HTMLAnchorElement;
            if (activeLink) {
                updateActiveNavItem(activeLink);
                await loadContent(file);
            }
        } else {
            // Default to README.md if no file specified
            const defaultLink = document.querySelector('.docs-nav a[data-file="README.md"]') as HTMLAnchorElement;
            if (defaultLink) {
                updateActiveNavItem(defaultLink);
                await loadContent('README.md');
            }
        }
    } catch (error) {
        console.error('Error initializing documentation:', error);
        showError('Error initializing documentation. Please refresh the page.');
    }
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initDocs);

// Function to load and render markdown content
async function loadDocumentation() {
    const contentContainer = document.querySelector('.docs-content');
    if (!contentContainer) return;

    try {
        // Get the current file from the URL
        const path = window.location.pathname;
        const file = path.split('/').pop();
        
        if (!file) return;

        // Fetch the markdown content
        const response = await fetch(`/docs/${file}`);
        if (!response.ok) {
            throw new Error('Failed to load documentation');
        }
        
        const markdown = await response.text();
        
        // Render the markdown content
        contentContainer.innerHTML = marked.parse(markdown);
        
        // Initialize statistics if we're on the statistics page
        if (file === 'STATISTICS.md') {
            if (typeof initStatistics === 'function') {
                initStatistics();
            }
        }
    } catch (error) {
        console.error('Error loading documentation:', error);
        contentContainer.innerHTML = `
            <div class="error">
                Failed to load documentation. Please try again later.
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set active navigation link
    const path = window.location.pathname;
    const file = path.split('/').pop();
    if (file) {
        const navLinks = document.querySelectorAll('.docs-nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `/docs/${file}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Load documentation content
    loadDocumentation();
});
