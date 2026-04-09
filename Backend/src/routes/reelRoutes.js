import express from 'express';
const router = express.Router();
import * as reelController from '../controllers/reelController.js';

router.post('/download', reelController.downloadReel);

export default router;
