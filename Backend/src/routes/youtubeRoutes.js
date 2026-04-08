const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');

router.post('/metadata', youtubeController.getMetadata);
router.post('/download', youtubeController.downloadMedia);

module.exports = router;
