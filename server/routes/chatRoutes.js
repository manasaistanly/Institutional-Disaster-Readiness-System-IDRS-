const express = require('express');
const router = express.Router();
const { chatHandler, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, chatHandler);
router.get('/history', protect, getChatHistory);

module.exports = router;
