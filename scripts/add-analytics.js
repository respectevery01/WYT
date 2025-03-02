/**
 * Add Google Analytics tracking code to all HTML files
 * Usage: node scripts/add-analytics.js
 */

const fs = require('fs');
const path = require('path');

// Google Analytics tracking code
const analyticsCode = `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-F63N2FG7KY"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-F63N2FG7KY');
  </script>
`;

// Function to recursively find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      findHtmlFiles(filePath, fileList);
    } else if (path.extname(file).toLowerCase() === '.html') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to add analytics code if not already present
function addAnalyticsToFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if analytics is already added
    if (content.includes('gtag') && content.includes('G-F63N2FG7KY')) {
      console.log(`✓ Analytics already present in: ${filePath}`);
      return false;
    }
    
    // Insert before </head>
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${analyticsCode}</head>`);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Added analytics to: ${filePath}`);
      return true;
    } else {
      console.log(`⚠ Could not find </head> tag in: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('🔍 Finding HTML files...');
  const htmlFiles = findHtmlFiles(path.resolve('.'));
  
  console.log(`🔍 Found ${htmlFiles.length} HTML files`);
  
  let modifiedCount = 0;
  htmlFiles.forEach(file => {
    if (addAnalyticsToFile(file)) {
      modifiedCount++;
    }
  });
  
  console.log(`✅ Analytics added to ${modifiedCount} files`);
}

main(); 