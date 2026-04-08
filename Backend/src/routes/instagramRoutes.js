const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');
const instagramRateLimiter = require('../middleware/rateLimiter');

// GET /api/instagram/:username
router.get('/:username', instagramRateLimiter, instagramController.getProfileData);

module.exports = router;
