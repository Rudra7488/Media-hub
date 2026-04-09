import axios from 'axios';
import * as cheerio from 'cheerio';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from 'ffmpeg-static';
import ffprobeInstaller from 'ffprobe-static';
import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uuidv4 = () => crypto.randomUUID();

// Configure ffmpeg to use static binaries
ffmpeg.setFfmpegPath(ffmpegInstaller);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

class ReelService {
    constructor() {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
        const inVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
        this.tempDir = inVercel ? path.join('/tmp', 'temp') : path.join(__dirname, '../../temp');
        this.downloadsDir = inVercel ? path.join('/tmp', 'downloads') : path.join(__dirname, '../../public/downloads');

        // Ensure directories exist
        fs.ensureDirSync(this.tempDir);
        fs.ensureDirSync(this.downloadsDir);
    }

    async extractVideoUrl(reelUrl) {
        try {
            const response = await axios.get(reelUrl, {
                headers: {
                    'User-Agent': this.userAgent,
                    'Cookie': process.env.INSTAGRAM_COOKIE || ''
                },
                timeout: 10000
            });

            const $ = cheerio.load(response.data);
            let videoUrl = $('meta[property="og:video"]').attr('content');

            if (!videoUrl) {
                // Try searching in script tags
                $('script').each((i, el) => {
                    const text = $(el).html();
                    if (text && text.includes('video_url')) {
                        const match = text.match(/"video_url":"([^"]+)"/);
                        if (match && match[1]) {
                            videoUrl = match[1].replace(/\\u0026/g, '&');
                        }
                    }
                });
            }

            if (!videoUrl) {
                throw new Error('Video URL not found. The reel might be private or blocked.');
            }

            return videoUrl;
        } catch (error) {
            console.error('Extraction Error:', error.message);
            throw new Error('Scraping failed: ' + (error.message.includes('404') ? 'Reel not found' : 'Instagram blocked request'));
        }
    }

    async downloadVideo(videoUrl) {
        const filename = `${uuidv4()}.mp4`;
        const tempPath = path.join(this.tempDir, filename);

        const response = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream',
            headers: { 'User-Agent': this.userAgent }
        });

        const writer = fs.createWriteStream(tempPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(tempPath));
            writer.on('error', reject);
        });
    }

    async processVideo(inputPath) {
        const id = uuidv4();
        const result = {
            video: `${id}-original.mp4`,
            audio: `${id}.mp3`,
            shorts: `${id}-shorts.mp4`,
            compressed: `${id}-whatsapp.mp4`
        };

        // MP4 Original
        await fs.copy(inputPath, path.join(this.downloadsDir, result.video));

        // A. Convert to MP3
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat('mp3')
                .on('error', reject)
                .on('end', resolve)
                .save(path.join(this.downloadsDir, result.audio));
        });

        // B. Resize to YouTube Shorts format (9:16)
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .videoFilters('scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920')
                .on('error', (err) => {
                    console.error('Shorts processing error:', err.message);
                    // Fallback to simple scale if crop fails
                    ffmpeg(inputPath)
                        .size('1080x1920')
                        .on('error', reject)
                        .on('end', resolve)
                        .save(path.join(this.downloadsDir, result.shorts));
                })
                .on('end', resolve)
                .save(path.join(this.downloadsDir, result.shorts));
        });

        // C. Compress video for WhatsApp
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .videoCodec('libx264')
                .outputOptions('-crf 28')
                .on('error', reject)
                .on('end', resolve)
                .save(path.join(this.downloadsDir, result.compressed));
        });

        return result;
    }

    async cleanup(tempPath) {
        if (tempPath) await fs.remove(tempPath).catch(() => null);
    }
}

export default new ReelService();
