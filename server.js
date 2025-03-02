const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Function to run the analytics script
function runAnalyticsScript() {
  console.log('Running analytics script...');
  exec('node scripts/add-analytics.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running analytics script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Analytics script stderr: ${stderr}`);
      return;
    }
    console.log(`Analytics script output: ${stdout}`);
  });
}

// Watch for new HTML files in the public directory
fs.watch(path.join(__dirname, 'public'), { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.html')) {
    console.log(`Detected change in HTML file: ${filename}`);
    // Run the analytics script when an HTML file is created or modified
    runAnalyticsScript();
  }
});

// Create a session tracker to remember which users have seen the intro
const userSessions = new Set();

// Serve static files except for main.html which we'll handle specially
app.use('/main.html', (req, res, next) => {
  // Check if this is a direct request for main.html
  const referer = req.get('Referer');
  const hasSeenIntro = referer && (
    referer.includes('/index.html') || 
    referer.endsWith('/') || 
    userSessions.has(req.ip)
  );
  
  if (hasSeenIntro) {
    // User is coming from index.html, allow access to main.html
    userSessions.add(req.ip); // Remember this user
    next();
  } else {
    // User is trying to access main.html directly, redirect to index
    res.redirect('/');
  }
});

// Serve other static files normally
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get articles
app.get('/api/articles', (req, res) => {
  const articlesDir = path.join(__dirname, 'articles');
  
  // Ensure the directory exists
  if (!fs.existsSync(articlesDir)) {
    return res.json({ articles: [] });
  }
  
  try {
    const files = fs.readdirSync(articlesDir)
      .filter(file => file.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a)); // Sort newer first
    
    const articles = files.map(file => {
      const filePath = path.join(articlesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // First try to extract date from filename (YYYY-MM-DD format)
      let date = null;
      const filenameMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
      if (filenameMatch) {
        date = filenameMatch[1];
      }
      
      // If no date in filename, try to find it in content (_Created on YYYY-MM-DD_)
      if (!date) {
        const contentDateMatch = content.match(/_Created on (\d{4}-\d{2}-\d{2})_/);
        if (contentDateMatch) {
          date = contentDateMatch[1];
        }
      }
      
      // Fallback to file stats only if no date found in filename or content
      if (!date) {
        const stats = fs.statSync(filePath);
        date = stats.birthtime.toISOString().split('T')[0];
      }
      
      // Extract title from markdown (first # heading)
      const titleMatch = content.match(/^# (.*)$/m);
      const title = titleMatch ? titleMatch[1] : file.replace(/\.md$/, '');
      
      return {
        id: file,
        title,
        date,
        content
      };
    });
    
    res.json({ articles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get links
app.get('/api/links', (req, res) => {
  const linksDir = path.join(__dirname, 'links');
  
  // Ensure the directory exists
  if (!fs.existsSync(linksDir)) {
    return res.json({ links: [] });
  }
  
  try {
    const files = fs.readdirSync(linksDir)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => b.localeCompare(a)); // Sort newer first
    
    const links = files.map(file => {
      const filePath = path.join(linksDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      try {
        const linkData = JSON.parse(content);
        const stats = fs.statSync(filePath);
        
        return {
          id: file,
          title: linkData.title,
          url: linkData.url,
          date: linkData.createdAt ? new Date(linkData.createdAt).toISOString().split('T')[0] : stats.birthtime.toISOString().split('T')[0]
        };
      } catch (error) {
        console.error(`Error parsing link file ${file}: ${error.message}`);
        return null;
      }
    }).filter(link => link !== null);
    
    res.json({ links });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific article by ID
app.get('/api/articles/:id', (req, res) => {
  const articleId = req.params.id;
  const articlePath = path.join(__dirname, 'articles', articleId);
  
  if (!fs.existsSync(articlePath)) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  try {
    const content = fs.readFileSync(articlePath, 'utf-8');
    
    // First try to extract date from filename (YYYY-MM-DD format)
    let date = null;
    const filenameMatch = articleId.match(/^(\d{4}-\d{2}-\d{2})/);
    if (filenameMatch) {
      date = filenameMatch[1];
    }
    
    // If no date in filename, try to find it in content (_Created on YYYY-MM-DD_)
    if (!date) {
      const contentDateMatch = content.match(/_Created on (\d{4}-\d{2}-\d{2})_/);
      if (contentDateMatch) {
        date = contentDateMatch[1];
      }
    }
    
    // Fallback to file stats only if no date found in filename or content
    if (!date) {
      const stats = fs.statSync(articlePath);
      date = stats.birthtime.toISOString().split('T')[0];
    }
    
    // Extract title from markdown
    const titleMatch = content.match(/^# (.*)$/m);
    const title = titleMatch ? titleMatch[1] : articleId.replace(/\.md$/, '');
    
    res.json({
      id: articleId,
      title,
      date,
      content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Terminal main page route
app.get('/main', (req, res) => {
  // Similar check as for /main.html
  const referer = req.get('Referer');
  const hasSeenIntro = referer && (
    referer.includes('/index.html') || 
    referer.endsWith('/')
  );
  
  if (hasSeenIntro) {
    // User is coming from index.html, allow access to main
    userSessions.add(req.ip); // Remember this user
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
  } else {
    // User is trying to access main directly, redirect to index
    res.redirect('/');
  }
});

// Add a route to register when a user has seen the intro (called from index.html)
app.get('/seen-intro', (req, res) => {
  userSessions.add(req.ip);
  res.status(200).send('OK');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 