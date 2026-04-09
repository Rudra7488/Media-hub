import express from 'express';
const router = express.Router();
import * as instagramController from '../controllers/instagramController.js';
import instagramRateLimiter from '../middleware/rateLimiter.js';

// GET /api/instagram/:username
router.get('/:username', instagramRateLimiter, instagramController.getProfileData);

export default router;
