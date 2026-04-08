# 🚀 MediaDash - High-Performance Media Downloader

MediaDash is a premium, high-speed media extraction platform built with **Next.js 16** and **Node.js**. It features a modern Navy/Blue glassmorphism UI and a powerful backend engine for downloading YouTube videos in high definition.

---

## ✨ Features
- **YouTube Downloader**: Extract videos in up to 1080p (Full HD) using our verified Android-Bypass engine.
- **Premium UI**: Modern dark theme with blue global shadowing and responsive glassmorphism components.
- **Auto-Cleaner**: Integrated server-side cron job that purges old downloads every hour, keeping the storage 100% clean.
- **Mobile Responsive**: Fully optimized for Laptop, Tablets, and Mobile devices.

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Lucide React.
- **Backend**: Node.js, Express, `yt-dlp-exec`, `ffmpeg-static`, `node-cron`.
- **Infrastructure**: Automated file management with `fs-extra`.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Rudra7488/Media-hub.git
cd Media-hub
```

### 2. Setup Backend
```bash
cd Backend
npm install
# Create a .env file (PORT=5000)
npm run dev
```

### 3. Setup Frontend
```bash
cd ../next-frontend
npm install
npm run dev
```

---

## ⚙️ Environment Variables (Backend)
- `PORT`: Server port (Default: 5000)
- `NODE_ENV`: development / production

---

## 🛡️ Key Performance Optimizations
- **Android Bypass**: Uses mobile player signatures to bypass YouTube's HD resolution blocks.
- **File Merging**: Automatically merges high-quality video and audio streams via FFmpeg.
- **Scheduled Maintenance**: Automatically deletes server-side files older than 60 minutes.

---

## 👨‍💻 Author
Developed by **MediaDash Team (Rudra7488)**
For educational purposes only. Not affiliated with Instagram or YouTube.
