const reelService = require('../services/reelService');

exports.downloadReel = async (req, res) => {
  const { url } = req.body;
  let tempPath = null;

  if (!url) {
    return res.status(400).json({ message: 'Instagram Reel URL is required' });
  }

  try {
    // 1. Extract video URL
    const videoUrl = await reelService.extractVideoUrl(url);

    // 2. Download to temp
    tempPath = await reelService.downloadVideo(videoUrl);

    // 3. Process with FFmpeg
    const results = await reelService.processVideo(tempPath);

    // 4. Return links
    return res.status(200).json({
      message: 'Reel processed successfully',
      downloads: {
        video: `/downloads/${results.video}`,
        audio: `/downloads/${results.audio}`,
        shorts: `/downloads/${results.shorts}`,
        compressed: `/downloads/${results.compressed}`
      }
    });

  } catch (error) {
    console.error('Reel Controller Error:', error.message);
    return res.status(500).json({
      message: error.message || 'Failed to process Reel'
    });
  } finally {
    // Cleanup temp file
    if (tempPath) {
      await reelService.cleanup(tempPath);
    }
  }
};
