require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const cron = require('node-cron');
const instagramRoutes = require('./src/routes/instagramRoutes');
const reelRoutes = require('./src/routes/reelRoutes');
const youtubeRoutes = require('./src/routes/youtubeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
const downloadsDir = path.join(__dirname, 'public/downloads');
fs.ensureDirSync(downloadsDir);
app.use('/downloads', express.static(downloadsDir));

/**
 * ULTRA-FAST CLEANER CRON JOB
 * This runs every 5 minutes.
 * It deletes files in 'public/downloads' that are older than 2 minutes.
 */
cron.schedule('*/5 * * * *', () => {
    console.log('[Cron] Running Rapid Auto-Cleaner (5m interval)...');
    fs.readdir(downloadsDir, (err, files) => {
        if (err) return console.error('[Cron] Error reading downloads dir:', err);
        
        const now = Date.now();
        const twoMinutes = 2 * 60 * 1000; // 2 Minutes strictly

        files.forEach(file => {
            if (file === '.gitkeep') return;
            const filePath = path.join(downloadsDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return console.error('[Cron] Stat Error:', err);

                // If file is older than 2 minutes, delete it IMMEDIATELY
                if (now - stats.mtime.getTime() > twoMinutes) {
                    fs.remove(filePath, err => {
                        if (err) return console.error(`[Cron] Error deleting ${file}:`, err);
                        console.log(`[Cron] Rapid Cleanup: Successfully deleted ${file}`);
                    });
                }
            });
        });
    });
});

// Middleware
const corsOptions = {
  origin: ['https://media-hub-three.vercel.app', 'http://localhost:3000'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/instagram', instagramRoutes);
app.use('/api/reel', reelRoutes);
app.use('/api/youtube', youtubeRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('MediaDash Premium API is running');
});

// Basic Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
