const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

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
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract title from markdown (first # heading)
      const titleMatch = content.match(/^# (.*)$/m);
      const title = titleMatch ? titleMatch[1] : file.replace(/\.md$/, '');
      
      return {
        id: file,
        title,
        date: stats.birthtime.toISOString().split('T')[0],
        content
      };
    });
    
    res.json({ articles });
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
    const stats = fs.statSync(articlePath);
    
    // Extract title from markdown
    const titleMatch = content.match(/^# (.*)$/m);
    const title = titleMatch ? titleMatch[1] : articleId.replace(/\.md$/, '');
    
    res.json({
      id: articleId,
      title,
      date: stats.birthtime.toISOString().split('T')[0],
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