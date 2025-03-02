#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'ls';
const param = args[1];

const articlesDir = path.join(__dirname, '..', 'articles');

// Ensure articles directory exists
if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

// Get all markdown files in the articles directory
function getArticles() {
  try {
    const files = fs.readdirSync(articlesDir)
      .filter(file => file.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a)); // Sort newer first

    return files.map(file => {
      const filePath = path.join(articlesDir, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract title from markdown (first # heading)
      const titleMatch = content.match(/^# (.*)$/m);
      const title = titleMatch ? titleMatch[1] : file.replace(/\.md$/, '');
      
      return {
        filename: file,
        title,
        path: filePath,
        created: stats.birthtime,
        modified: stats.mtime,
        content
      };
    });
  } catch (error) {
    console.error(`Error reading articles directory: ${error.message}`);
    return [];
  }
}

// Display a list of articles
function listArticles(page = 1) {
  const articles = getArticles();
  const pageSize = 5;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageArticles = articles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(articles.length / pageSize);
  
  console.log(`\n== Articles (Page ${page}/${totalPages || 1}) ==\n`);
  
  if (articles.length === 0) {
    console.log('No articles found. Create one with: npm run article "Your Title"');
    return;
  }
  
  pageArticles.forEach((article, index) => {
    const displayDate = article.created.toISOString().split('T')[0];
    console.log(`${startIndex + index + 1}. ${article.title} (${displayDate})`);
  });
  
  console.log('\nCommands:');
  console.log('- npm run docs ls [page]      : List articles (page number optional)');
  console.log('- npm run docs view [number]  : View article by number');
  console.log('- npm run docs next           : Show next page');
  console.log('- npm run docs prev           : Show previous page');
  
  // Store current page in a temp file for next/prev commands
  fs.writeFileSync(path.join(__dirname, '..', '.current-page'), String(page));
}

// View a specific article
function viewArticle(number) {
  const articles = getArticles();
  const index = number - 1;
  
  if (index < 0 || index >= articles.length) {
    console.error(`Article number ${number} not found.`);
    console.log('Use "npm run docs ls" to see available articles.');
    return;
  }
  
  const article = articles[index];
  console.log(`\n${article.content}`);
}

// Show next page of articles
function nextPage() {
  let currentPage = 1;
  try {
    if (fs.existsSync(path.join(__dirname, '..', '.current-page'))) {
      currentPage = parseInt(fs.readFileSync(path.join(__dirname, '..', '.current-page'), 'utf-8'));
    }
  } catch (error) {
    // Ignore errors reading page
  }
  
  const articles = getArticles();
  const totalPages = Math.ceil(articles.length / 5);
  
  if (currentPage < totalPages) {
    listArticles(currentPage + 1);
  } else {
    console.log('Already at the last page.');
    listArticles(currentPage);
  }
}

// Show previous page of articles
function prevPage() {
  let currentPage = 1;
  try {
    if (fs.existsSync(path.join(__dirname, '..', '.current-page'))) {
      currentPage = parseInt(fs.readFileSync(path.join(__dirname, '..', '.current-page'), 'utf-8'));
    }
  } catch (error) {
    // Ignore errors reading page
  }
  
  if (currentPage > 1) {
    listArticles(currentPage - 1);
  } else {
    console.log('Already at the first page.');
    listArticles(1);
  }
}

// Handle different commands
switch (command) {
  case 'ls':
    const page = param ? parseInt(param) : 1;
    listArticles(isNaN(page) ? 1 : page);
    break;
    
  case 'view':
    if (!param) {
      console.error('Please specify an article number to view.');
      console.log('Usage: npm run docs view [number]');
      break;
    }
    const number = parseInt(param);
    if (isNaN(number)) {
      console.error('Article number must be a number.');
      break;
    }
    viewArticle(number);
    break;
    
  case 'next':
    nextPage();
    break;
    
  case 'prev':
    prevPage();
    break;
    
  default:
    console.error(`Unknown command: ${command}`);
    console.log('Available commands: ls, view, next, prev');
    break;
} 