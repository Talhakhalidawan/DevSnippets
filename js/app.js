// Global variables
let snippetsIndex;
let currentSnippetId = null;
let currentPage = 1;
const itemsPerPage = 20;
let filteredResults = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadSnippets();
    
    // Check if we're on the detail page
    if (window.location.pathname.includes('/tricks/')) {
        handleDetailPage();
    } else {
        // Main page initialization
        initSearch();
        renderInitialSnippets();
    }
});

// Load snippets from external data.js file
async function loadSnippets() {
    try {
        // snippetsData is already available from data.js
        // Limit to first 20 tricks as requested
        if (snippetsData && snippetsData.length > 20) {
            snippetsData = snippetsData.slice(0, 20);
        }
        
        // Build the search index
        buildSearchIndex();
        console.log('Snippets loaded successfully:', snippetsData.length);
    } catch (error) {
        console.error('Error loading snippets:', error);
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <p>Failed to load snippets. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Handle detail page logic
function handleDetailPage() {
    // Extract the ID from the URL
    const urlPath = window.location.pathname;
    const snippetId = urlPath.split('/').pop().replace('.html', '');
    
    // If on a generic detail page, get the ID from URL parameter
    if (urlPath.endsWith('detail.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const paramId = urlParams.get('id');
        if (paramId) {
            loadSnippetDetail(paramId);
        } else {
            showErrorMessage('Snippet ID not found in URL');
        }
    } else {
        // Regular detail page (not using the parameter approach)
        loadSnippetDetail(snippetId);
    }
}

// Load snippet detail by ID
function loadSnippetDetail(id) {
    // Wait until snippetsData is loaded
    if (snippetsData.length === 0) {
        // If data isn't loaded yet, try again in a short time
        setTimeout(() => loadSnippetDetail(id), 100);
        return;
    }
    
    const snippet = snippetsData.find(s => s.id === id);
    
    if (!snippet) {
        showErrorMessage('Snippet not found');
        return;
    }
    
    // Update page title
    document.title = `${snippet.title} | DevSnippets`;
    
    // Update content if elements exist
    const titleElement = document.querySelector('.trick-detail h1');
    const descriptionElement = document.querySelector('.trick-detail .description');
    const codeElement = document.querySelector('.code-block code');
    const tagsContainer = document.querySelector('.trick-detail .tags');
    
    if (titleElement) titleElement.textContent = snippet.title;
    
    if (descriptionElement) {
        // Create a more detailed description if available
        const descriptionHTML = `<p>${snippet.description}</p>`;
        descriptionElement.innerHTML = descriptionHTML;
    }
    
    if (codeElement) {
        codeElement.textContent = snippet.code;
        codeElement.className = `language-${snippet.language}`;
        // Trigger Prism.js to highlight the code
        if (window.Prism) {
            Prism.highlightElement(codeElement);
        }
    }
    
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        snippet.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
    }
    
    // Add copy code button if not already present
    if (codeElement && !document.querySelector('.copy-button')) {
        const codeBlock = document.querySelector('.code-block');
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
        
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(snippet.code).then(() => {
                showCopiedMessage();
                copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg> Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
                }, 2000);
            });
        });
        
        codeBlock.appendChild(copyButton);
    }
}

// Show error message on detail page
function showErrorMessage(message) {
    const container = document.querySelector('.trick-detail') || document.querySelector('main');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Error</h2>
                <p>${message}</p>
                <a href="/" class="back-link">← Back to homepage</a>
            </div>
        `;
    }
}

// Build search index using Lunr.js
function buildSearchIndex() {
    snippetsIndex = lunr(function() {
        this.field('title', { boost: 10 });
        this.field('description', { boost: 5 });
        this.field('tags', { boost: 3 });
        this.field('id', { boost: 8 });
        this.ref('id');

        // Enable partial word matching
        this.pipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.stemmer);

        snippetsData.forEach(snippet => {
            this.add({
                id: snippet.id,
                title: snippet.title,
                description: snippet.description,
                tags: snippet.tags.join(' ')
            });
        });
    });
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.trim();
        currentPage = 1; // Reset to page 1 when search changes
        
        if (query.length === 0) {
            renderInitialSnippets();
            return;
        }
        
        performSearch(query);
    }, 300));
}

// Perform search using Lunr.js
function performSearch(query) {
    try {
        // Check if snippetsIndex exists
        if (!snippetsIndex) {
            console.log("Search index not built yet, displaying all snippets");
            filteredResults = snippetsData;
            renderPagination(filteredResults.length);
            renderSearchResults(getCurrentPageItems());
            return;
        }
        
        // Add wildcard to each term to allow partial matching
        const terms = query.toLowerCase().split(/\s+/);
        const wildcardQuery = terms.map(term => `${term}*`).join(' ');
        
        let results = [];
        try {
            // Try standard search first
            results = snippetsIndex.search(wildcardQuery);
        } catch (e) {
            console.log("Standard search failed, trying simple search");
            // Fall back to simple search if syntax error
            try {
                results = snippetsIndex.search(query);
            } catch (error) {
                console.error("Search syntax error:", error);
                // Show all results if search fails
                filteredResults = snippetsData;
                renderPagination(filteredResults.length);
                renderSearchResults(getCurrentPageItems());
                return;
            }
        }
        
        if (results.length === 0) {
            // Try fuzzy search if no results
            const fuzzyQuery = terms.map(term => `${term}~1`).join(' ');
            try {
                results = snippetsIndex.search(fuzzyQuery);
            } catch (e) {
                // Ignore errors in fuzzy search
            }
        }
        
        if (results.length === 0) {
            renderNoResults();
            return;
        }
        
        const searchResults = results.map(result => {
            const snippet = snippetsData.find(s => s.id === result.ref);
            return snippet;
        }).filter(Boolean); // Filter out any undefined results
        
        filteredResults = searchResults;
        renderPagination(filteredResults.length);
        renderSearchResults(getCurrentPageItems());
    } catch (error) {
        console.error('Search error:', error);
        // On error, display all available snippets
        filteredResults = snippetsData;
        renderPagination(filteredResults.length);
        renderSearchResults(getCurrentPageItems());
    }
}

// Render initial snippets
function renderInitialSnippets() {
    filteredResults = snippetsData;
    renderPagination(filteredResults.length);
    renderSearchResults(getCurrentPageItems());
}

// Get items for current page
function getCurrentPageItems() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredResults.slice(startIndex, endIndex);
}

// Render pagination controls
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Only show pagination if there are multiple pages
    if (totalPages <= 1) {
        const paginationContainer = document.querySelector('.pagination');
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }
        return;
    }
    
    let paginationContainer = document.querySelector('.pagination');
    
    // Create pagination container if it doesn't exist
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination';
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer && resultsContainer.parentNode) {
            resultsContainer.parentNode.insertBefore(paginationContainer, resultsContainer.nextSibling);
        }
    }
    
    // Generate pagination buttons
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<button class="page-button prev-button" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if needed
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="page-button" data-page="1">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="page-button ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="page-button" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `<button class="page-button next-button" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Add event listeners to pagination buttons
    const pageButtons = paginationContainer.querySelectorAll('.page-button');
    pageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.classList.contains('prev-button')) {
                if (currentPage > 1) {
                    currentPage--;
                    renderPagination(totalItems);
                    renderSearchResults(getCurrentPageItems());
                }
            } else if (button.classList.contains('next-button')) {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPagination(totalItems);
                    renderSearchResults(getCurrentPageItems());
                }
            } else {
                const page = parseInt(button.getAttribute('data-page'));
                if (page !== currentPage) {
                    currentPage = page;
                    renderPagination(totalItems);
                    renderSearchResults(getCurrentPageItems());
                }
            }
            
            // Scroll to top of results
            const resultsContainer = document.getElementById('search-results');
            if (resultsContainer) {
                resultsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Render search results
function renderSearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>No snippets found. Try a different search term.</p>
            </div>
        `;
        return;
    }
    
    results.forEach(snippet => {
        const card = createSnippetCard(snippet);
        resultsContainer.appendChild(card);
    });
}

// Render no results message
function renderNoResults() {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
        <div class="no-results">
            <p>No snippets found. Try a different search term.</p>
        </div>
    `;
    
    // Clear pagination when no results
    const paginationContainer = document.querySelector('.pagination');
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
    }
}

// Create a snippet card element
function createSnippetCard(snippet) {
    const card = document.createElement('div');
    card.className = 'snippet-card';
    
    const title = document.createElement('h2');
    title.textContent = snippet.title;
    
    const description = document.createElement('p');
    // Limit description to ~50 words
    const words = snippet.description.split(' ');
    description.textContent = words.length > 50 
        ? words.slice(0, 50).join(' ') + '...' 
        : snippet.description;
    
    // Create a link to the detail page
    const link = document.createElement('a');
    link.href = `tricks/detail.html?id=${snippet.id}`;
    link.textContent = 'View Details';
    link.className = 'view-link';
    
    // Create tags container
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'tags';
    
    snippet.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = tag;
                performSearch(tag);
            }
        });
        tagsContainer.appendChild(tagElement);
    });
    
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(tagsContainer);
    card.appendChild(link);
    
    // Make the entire card clickable
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking on a tag or the view link
        if (!e.target.closest('.tag') && !e.target.closest('.view-link')) {
            window.location.href = link.href;
        }
    });
    
    return card;
}

// Show copied message
function showCopiedMessage() {
    const message = document.getElementById('copied-message') || createCopiedMessage();
    message.style.display = 'block';
    
    setTimeout(() => {
        message.style.display = 'none';
    }, 2000);
}

// Create copied message element if it doesn't exist
function createCopiedMessage() {
    const message = document.createElement('div');
    message.id = 'copied-message';
    message.className = 'copied-message';
    message.textContent = 'Copied to clipboard!';
    message.style.display = 'none';
    document.body.appendChild(message);
    return message;
}

// Debounce function to limit how often a function is called
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
} 