const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/issues', adminController.getIssues);
router.patch('/issues/:id/status', adminController.updateStatus);
router.get('/stats', adminController.getStats);

module.exports = router;
