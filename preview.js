#!/usr/bin/env node

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set proper MIME types
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (req.path.endsWith('.json')) {
    res.setHeader('Content-Type', 'application/json');
  }
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all routes (SPA client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌐 This preview mimics Cloudflare Pages deployment environment`);
}); 