/**
 * src/routes/chat.js
 * POST /api/ai/chat
 * POST /api/ai/chat/stream
 */

const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { chatRateLimiter } = require('../middleware/rateLimit');
const { handleChat, handleChatStream } = require('../controllers/chatController');

const router = express.Router();

router.post('/chat', requireAuth, chatRateLimiter, handleChat);
router.post('/chat/stream', requireAuth, chatRateLimiter, handleChatStream);

module.exports = router;
