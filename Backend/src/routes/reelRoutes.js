const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');

router.post('/download', reelController.downloadReel);

module.exports = router;
