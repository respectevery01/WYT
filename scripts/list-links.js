#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'ls';
const param = args[1];

const linksDir = path.join(__dirname, '..', 'links');

// Ensure links directory exists
if (!fs.existsSync(linksDir)) {
  fs.mkdirSync(linksDir, { recursive: true });
}

// Get all JSON files in the links directory
function getLinks() {
  try {
    const files = fs.readdirSync(linksDir)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => b.localeCompare(a)); // Sort newer first

    return files.map(file => {
      const filePath = path.join(linksDir, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      try {
        const linkData = JSON.parse(content);
        return {
          filename: file,
          title: linkData.title,
          url: linkData.url,
          path: filePath,
          created: new Date(linkData.createdAt || stats.birthtime),
          modified: new Date(linkData.updatedAt || stats.mtime)
        };
      } catch (error) {
        console.error(`Error parsing link file ${file}: ${error.message}`);
        return null;
      }
    }).filter(link => link !== null);
  } catch (error) {
    console.error(`Error reading links directory: ${error.message}`);
    return [];
  }
}

// Display a list of links
function listLinks(page = 1) {
  const links = getLinks();
  const pageSize = 5;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageLinks = links.slice(startIndex, endIndex);
  const totalPages = Math.ceil(links.length / pageSize);
  
  console.log(`\n== Links (Page ${page}/${totalPages || 1}) ==\n`);
  
  if (links.length === 0) {
    console.log('No links found. Create one with: npm run link "https://example.com" "Example Website"');
    return;
  }
  
  pageLinks.forEach((link, index) => {
    const displayDate = link.created.toISOString().split('T')[0];
    console.log(`${startIndex + index + 1}. ${link.title}`);
    console.log(`   URL: ${link.url}`);
    console.log(`   Created: ${displayDate}`);
    console.log('');
  });
  
  console.log('Commands:');
  console.log('- npm run links ls [page]    : List links (page number optional)');
  console.log('- npm run links next         : Show next page');
  console.log('- npm run links prev         : Show previous page');
  
  // Store current page in a temp file for next/prev commands
  fs.writeFileSync(path.join(__dirname, '..', '.current-links-page'), String(page));
}

// Show next page of links
function nextPage() {
  let currentPage = 1;
  try {
    if (fs.existsSync(path.join(__dirname, '..', '.current-links-page'))) {
      currentPage = parseInt(fs.readFileSync(path.join(__dirname, '..', '.current-links-page'), 'utf-8'));
    }
  } catch (error) {
    // Ignore errors reading page
  }
  
  const links = getLinks();
  const totalPages = Math.ceil(links.length / 5);
  
  if (currentPage < totalPages) {
    listLinks(currentPage + 1);
  } else {
    console.log('Already at the last page.');
    listLinks(currentPage);
  }
}

// Show previous page of links
function prevPage() {
  let currentPage = 1;
  try {
    if (fs.existsSync(path.join(__dirname, '..', '.current-links-page'))) {
      currentPage = parseInt(fs.readFileSync(path.join(__dirname, '..', '.current-links-page'), 'utf-8'));
    }
  } catch (error) {
    // Ignore errors reading page
  }
  
  if (currentPage > 1) {
    listLinks(currentPage - 1);
  } else {
    console.log('Already at the first page.');
    listLinks(1);
  }
}

// Handle different commands
switch (command) {
  case 'ls':
    const page = param ? parseInt(param) : 1;
    listLinks(isNaN(page) ? 1 : page);
    break;
    
  case 'next':
    nextPage();
    break;
    
  case 'prev':
    prevPage();
    break;
    
  default:
    console.error(`Unknown command: ${command}`);
    console.log('Available commands: ls, next, prev');
    break;
} 