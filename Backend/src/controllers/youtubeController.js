import youtubeService from '../services/youtubeService.js';

export const getMetadata = async (req, res) => {
    const { url } = req.body;
    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
        return res.status(400).json({ message: 'Valid YouTube URL is required' });
    }

    try {
        const metadata = await youtubeService.getMetadata(url);
        return res.status(200).json(metadata);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const downloadMedia = async (req, res) => {
    const { url, format, quality, title } = req.body; 
    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const filename = await youtubeService.downloadMedia(url, format, quality, title);
        return res.status(200).json({
            message: 'Download successful',
            downloadUrl: `/downloads/${filename}`
        });
    } catch (error) {
        let status = 500;
        if (error.message.includes('429')) status = 429;
        return res.status(status).json({ message: error.message });
    }
};
