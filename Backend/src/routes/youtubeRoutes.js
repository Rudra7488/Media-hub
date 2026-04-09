import express from 'express';
const router = express.Router();
import * as youtubeController from '../controllers/youtubeController.js';

router.post('/metadata', youtubeController.getMetadata);
router.post('/download', youtubeController.downloadMedia);

export default router;
