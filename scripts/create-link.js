#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get link URL and title from command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Please provide a link URL and title.');
  console.error('Usage: npm run link "https://example.com" "Example Website"');
  process.exit(1);
}

const url = args[0];
const title = args.slice(1).join(' ');

// Validate URL format
if (!url.startsWith('http://') && !url.startsWith('https://')) {
  console.error('Error: URL must start with http:// or https://');
  process.exit(1);
}

// Create the links directory if it doesn't exist
const linksDir = path.join(__dirname, '..', 'links');
if (!fs.existsSync(linksDir)) {
  fs.mkdirSync(linksDir, { recursive: true });
}

// Get current date for the link
const now = new Date();
const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format

// Create a sanitized filename
const sanitizedTitle = title
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, '')
  .replace(/\s+/g, '-');

// Create filename with date prefix for better sorting
const filename = `${formattedDate}-${sanitizedTitle}.json`;

// Create link JSON structure
const linkData = {
  url: url,
  title: title,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString()
};

// Write the file
const filePath = path.join(linksDir, filename);
fs.writeFileSync(filePath, JSON.stringify(linkData, null, 2));

console.log(`✅ Added new link: "${title}"`);
console.log(`📝 File created at: ${filePath}`);
console.log(`\nYou can view your links using: git init in the terminal`); 