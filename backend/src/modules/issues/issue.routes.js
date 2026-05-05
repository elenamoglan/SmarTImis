const express = require('express');
const router = express.Router();
const issueController = require('./issue.controller');
const { protect } = require('../../middleware/authMiddleware');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const path = require('path');
const fs = require('fs');

let upload;

if (process.env.IS_SERVERLESS) {
  // Configure multer-s3 for AWS Lambda
  const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.UPLOADS_BUCKET_NAME || 'smartcity-uploads-bucket',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, 'uploads/' + Date.now() + '-' + file.originalname);
      }
    })
  });
} else {
  // Configure multer for local file uploads
  const uploadDir = path.join(__dirname, '../../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  upload = multer({ storage: storage });
}

router.get('/', issueController.getIssues);
router.get('/my-issues', protect, issueController.getUserIssues);
router.get('/:id', issueController.getIssueById);
router.post('/', protect, upload.single('image'), issueController.createIssue);
router.post('/:id/like', protect, issueController.likeIssue);

module.exports = router;
