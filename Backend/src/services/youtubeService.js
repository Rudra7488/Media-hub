import youtubedl from 'youtube-dl-exec';
import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
const uuidv4 = () => crypto.randomUUID();
import axios from 'axios';
import ffmpegPath from 'ffmpeg-static';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


class YoutubeService {
  constructor() {
    this.downloadsDir = path.join(__dirname, '../../public/downloads');
    fs.ensureDirSync(this.downloadsDir);
  }

  async getMetadata(url) {
    try {
      // Use oEmbed but also try to get formats if possible via yt-dlp
      const response = await axios.get(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);

      // We manually define some common qualities since extracting all formats via yt-dlp is slow and risky for 429
      const qualities = [
        { id: 'best', label: 'Highest Quality (Auto)' },
        { id: '137+140', label: '1080p (Full HD)' },
        { id: '136+140', label: '720p (HD)' },
        { id: '135+140', label: '480p' },
        { id: '134+140', label: '360p' }
      ];

      return {
        title: response.data.title,
        thumbnail: response.data.thumbnail_url,
        duration: "YouTube Media",
        qualities: qualities
      };
    } catch (error) {
      console.error('Metadata Extraction Error:', error.message);
      throw new Error('Failed to fetch YouTube details. Verify the link.');
    }
  }

  async downloadMedia(url, format = 'video', quality = 'best', title = 'media') {
    // Sanitize title for filename
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
    const id = uuidv4().substring(0, 8);
    const filename = `${safeTitle}_${id}${format === 'audio' ? '.mp3' : '.mp4'}`;
    const outputPath = path.join(this.downloadsDir, filename);

    try {
      let options = {};

      if (format === 'audio') {
        options = {
          extractAudio: true,
          audioFormat: 'mp3',
          output: outputPath,
          ffmpegLocation: ffmpegPath
        };
      } else {
        // Handle quality selection
        const formatSelection = quality === 'best' ? 'bestvideo+bestaudio/best' : `${quality}/best`;
        options = {
          format: formatSelection,
          mergeOutputFormat: 'mp4',
          output: outputPath,
          ffmpegLocation: ffmpegPath
        };
      }

      await youtubedl(url, {
        ...options,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        extractorArgs: 'youtube:player_client=android,ios,tv'
      });

      return filename;
    } catch (error) {
      console.error(`Download Error:`, error.message);
      if (error.message.includes('429')) {
        throw new Error('YouTube blocked the request (429). Try again with a different quality or wait.');
      }
      throw new Error('Download failed. YouTube protection might be active.');
    }
  }
}

export default new YoutubeService();
