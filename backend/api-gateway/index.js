const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));

// Static uploads proxy
app.use('/uploads', createProxyMiddleware({ target: process.env.ISSUE_SERVICE_URL || 'http://issue-service:3002', changeOrigin: true }));

// Auth Service Route
app.use('/api/auth', createProxyMiddleware({ target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001', changeOrigin: true }));

// Issues Service Route
app.use('/api/issues', createProxyMiddleware({ target: process.env.ISSUE_SERVICE_URL || 'http://issue-service:3002', changeOrigin: true }));

// Notification Service Route
app.use('/api/notifications', createProxyMiddleware({ target: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3003', changeOrigin: true }));

// Admin Routes proxy mapping (since admin handles issues/stats)
app.use('/api/admin', createProxyMiddleware({ target: process.env.ISSUE_SERVICE_URL || 'http://issue-service:3002', changeOrigin: true }));

// Serve frontend static files
// We will mount the frontend build directory to /app/public in docker-compose.yml
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
