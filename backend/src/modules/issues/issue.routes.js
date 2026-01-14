const express = require('express');
const router = express.Router();
const issueController = require('./issue.controller');
const { protect } = require('../../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/', issueController.getIssues);
router.get('/my-issues', protect, issueController.getUserIssues);
router.get('/:id', issueController.getIssueById);
router.post('/', protect, upload.single('image'), issueController.createIssue);
router.post('/:id/like', protect, issueController.likeIssue);

module.exports = router;
