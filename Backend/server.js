require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const instagramRoutes = require('./src/routes/instagramRoutes');
const reelRoutes = require('./src/routes/reelRoutes');
const youtubeRoutes = require('./src/routes/youtubeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/instagram', instagramRoutes);
app.use('/api/reel', reelRoutes);
app.use('/api/youtube', youtubeRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('MediaDash API is running');
});

// Basic Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
