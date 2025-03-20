const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_API_URL = 'https://speedydl.hridoy.top/api';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/facebook', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const response = await axios.get(`${BASE_API_URL}/facebook?url=${encodeURIComponent(url)}`);
    res.json(response.data);
  } catch (error) {
    console.error('Facebook API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
});

app.get('/api/instagram', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const response = await axios.get(`${BASE_API_URL}/instagram?url=${encodeURIComponent(url)}`);
    res.json(response.data);
  } catch (error) {
    console.error('Instagram API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
});

app.get('/api/tiktok', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const response = await axios.get(`${BASE_API_URL}/tiktok?url=${encodeURIComponent(url)}`);
    res.json(response.data);
  } catch (error) {
    console.error('TikTok API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
});

app.get('/api/twitter', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const response = await axios.get(`${BASE_API_URL}/twitter?url=${encodeURIComponent(url)}`);
    res.json(response.data);
  } catch (error) {
    console.error('Twitter API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
});

app.get('/api/youtube', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const response = await axios.get(`${BASE_API_URL}/youtube?url=${encodeURIComponent(url)}`);
    res.json(response.data);
  } catch (error) {
    console.error('YouTube API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});