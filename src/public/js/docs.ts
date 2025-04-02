// Declare the global marked variable
declare const marked: {
    setOptions: (options: any) => void;
    parse: (content: string) => string;
};

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
        return marked.parse(content);
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
    const contentContainer = document.getElementById('content-container');
    if (contentContainer) {
        contentContainer.innerHTML = '<div class="loading">Loading documentation...</div>';
    }
}

// Function to show error state
function showError(message: string): void {
    const contentContainer = document.getElementById('content-container');
    if (contentContainer) {
        contentContainer.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Function to load and display content
async function loadContent(fileName: string): Promise<void> {
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) return;

    try {
        showLoading();
        const content = await loadMarkdownContent(fileName);
        contentContainer.innerHTML = renderMarkdown(content);
    } catch (error) {
        console.error(`Error loading content for ${fileName}:`, error);
        showError(`Error loading ${fileName}. Please try again later.`);
    }
}

// Function to handle navigation clicks
function handleNavClick(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLAnchorElement;
    const fileName = target.getAttribute('data-file');
    
    if (!fileName) return;
    
    // Update active state
    updateActiveNavItem(target);
    
    // Load content
    loadContent(fileName);
}

// Initialize documentation
async function initDocs(): Promise<void> {
    try {
        // Add click handlers to navigation links
        const navLinks = document.querySelectorAll('.docs-nav a[data-file]');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Load initial content (README.md)
        const defaultLink = document.querySelector('.docs-nav a[data-file="README.md"]') as HTMLAnchorElement;
        if (defaultLink) {
            updateActiveNavItem(defaultLink);
            await loadContent('README.md');
        }
    } catch (error) {
        console.error('Error initializing documentation:', error);
        showError('Error initializing documentation. Please refresh the page.');
    }
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initDocs);

// Handle navigation
document.querySelectorAll('.docs-nav a').forEach((link: Element) => {
    if (link instanceof HTMLAnchorElement) {
        link.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const targetId = link.getAttribute('href')?.substring(1);
            
            if (!targetId) return;
            
            // Update active state
            document.querySelectorAll('.docs-nav a').forEach((a: Element) => {
                if (a instanceof HTMLAnchorElement) {
                    a.classList.remove('active');
                }
            });
            link.classList.add('active');
            
            // Scroll to target
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}); 