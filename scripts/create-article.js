#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get article title from command line arguments
const args = process.argv.slice(2);
const title = args.join(' ');

if (!title) {
  console.error('Please provide an article title.');
  console.error('Usage: npm run article "Your Article Title"');
  process.exit(1);
}

// Create a sanitized filename from the title
const sanitizedTitle = title
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, '')
  .replace(/\s+/g, '-');

// Get current date for the article
const now = new Date();
const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format

// Create filename with date prefix for better sorting
const filename = `${formattedDate}-${sanitizedTitle}.md`;
const articlesDir = path.join(__dirname, '..', 'articles');

// Ensure articles directory exists
if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

// Create article content
const content = `# ${title}

_Created on ${formattedDate}_

Start writing your article here...

`;

// Write the file
const filePath = path.join(articlesDir, filename);
fs.writeFileSync(filePath, content);

console.log(`✅ Created new article: "${title}"`);
console.log(`📝 File created at: ${filePath}`);
console.log(`\nYou can now edit this file in your favorite markdown editor.`);
console.log(`\nTo view your articles, use: npm run docs ls`); 