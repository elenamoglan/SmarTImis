const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const authRoutes = require('./modules/auth/auth.routes');
const issueRoutes = require('./modules/issues/issue.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Determine the correct uploads directory based on the environment
const uploadDir = process.env.IS_SERVERLESS
  ? '/tmp/uploads'
  : path.join(__dirname, '../uploads');

// Static files (uploads)
app.use('/uploads', express.static(uploadDir));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling
app.use(errorHandler);

// Catch all for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
