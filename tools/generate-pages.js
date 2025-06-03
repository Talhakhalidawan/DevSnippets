/**
 * This script generates individual HTML pages for each trick in the tricks.json file.
 * It's a helper tool for development and doesn't need to be included in the production build.
 * 
 * To use this script:
 * 1. Install Node.js
 * 2. Run this script with: node tools/generate-pages.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const jsonPath = path.join(__dirname, '..', 'data', 'tricks.json');
const templatePath = path.join(__dirname, '..', 'tricks', 'template.html');
const outputDir = path.join(__dirname, '..', 'tricks');

// Load data
const tricksData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const templateContent = fs.readFileSync(templatePath, 'utf8');

// Create tricks directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Process each trick
tricksData.forEach(trick => {
    console.log(`Generating page for: ${trick.title}`);
    
    let pageContent = templateContent;
    
    // Replace template placeholders
    pageContent = pageContent.replace(/{{title}}/g, trick.title);
    pageContent = pageContent.replace(/{{description}}/g, trick.description);
    pageContent = pageContent.replace(/{{language}}/g, trick.language);
    
    // Handle code - escape HTML entities
    const escapedCode = trick.code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    pageContent = pageContent.replace(/{{code}}/g, escapedCode);
    
    // Handle tags
    let tagsHtml = '';
    trick.tags.forEach(tag => {
        tagsHtml += `<span class="tag">${tag}</span>\n`;
    });
    
    // Replace tags placeholder with actual tags HTML
    pageContent = pageContent.replace(/{{#each tags}}[\s\S]*?{{\/each}}/g, tagsHtml);
    
    // Write file
    const outputPath = path.join(outputDir, `${trick.id}.html`);
    fs.writeFileSync(outputPath, pageContent);
});

console.log('All pages generated successfully!'); 