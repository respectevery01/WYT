const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 提供静态文件
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

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 终端主页路由
app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 