const express = require('express');
const router = express.Router();
const NotificationController = require('./notification.controller');
const { protect } = require('../../middleware/authMiddleware');

router.get('/', protect, NotificationController.getMyNotifications);
router.patch('/:id/read', protect, NotificationController.markRead);

module.exports = router;
