const issueService = require('./issue.service');
const axios = require('axios');

const createIssue = async (req, res, next) => {
    try {
        const { title, description, latitude, longitude, address, category } = req.body;
        let image_url = null;
        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        if (!title || !description || !latitude || !longitude || !category) {
            res.status(400);
            throw new Error('Please provide all fields');
        }

        const issue = await issueService.createIssue({
            user_id: req.user.id,
            title,
            description,
            image_url,
            latitude,
            longitude,
            address,
            category,
        });

        // Notify all admins via REST to Auth Service and Notification Service
        try {
            const authUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
            const notificationUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3003';

            const adminsRes = await axios.get(`${authUrl}/api/users/admins`);
            const admins = adminsRes.data;

            for (const admin of admins) {
                await axios.post(`${notificationUrl}/api/notifications/system`, {
                    user_id: admin.id,
                    report_id: issue.id,
                    message: `New issue reported: "${title}" by ${req.user.name || 'a citizen'}`
                });
            }
        } catch (notifyErr) {
            console.error("Failed to notify admins", notifyErr.message);
            // Don't fail the request if notification fails
        }

        res.status(201).json(issue);
    } catch (error) {
        next(error);
    }
};

const getIssues = async (req, res, next) => {
    try {
        const { page, limit, status } = req.query;
        const issues = await issueService.getIssues(page, limit, status);
        res.json(issues);
    } catch (error) {
        next(error);
    }
};

const getIssueById = async (req, res, next) => {
    try {
        const issue = await issueService.getIssueById(req.params.id);
        res.json(issue);
    } catch (error) {
        next(error);
    }
};

const getUserIssues = async (req, res, next) => {
    try {
        const issues = await issueService.getUserIssues(req.user.id);
        res.json(issues);
    } catch (error) {
        next(error);
    }
};

const likeIssue = async (req, res, next) => {
    try {
        const result = await issueService.likeIssue(req.user.id, req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { createIssue, getIssues, getIssueById, getUserIssues, likeIssue };
