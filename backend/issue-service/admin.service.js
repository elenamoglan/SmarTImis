const issueRepository = require('./issue.repository');
const axios = require('axios');

const getAllIssues = async (page, limit, status) => {
  const offset = (page - 1) * limit;
  return await issueRepository.findAllIssues(limit, offset, status);
};

const updateIssueStatus = async (id, status) => {
  const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid status');
  }
  
  const issue = await issueRepository.updateIssueStatus(id, status);
  if (!issue) {
    throw new Error('Issue not found');
  }

  // Trigger Notification via REST API
  if (issue.user_id) {
      try {
          const notificationUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3003';
          await axios.post(`${notificationUrl}/api/notifications/system`, {
              user_id: issue.user_id,
              report_id: issue.id,
              message: `Your report "${issue.title}" status has been updated to ${status}.`
          });
      } catch (err) {
          console.error("Failed to notify user", err.message);
      }
  }

  return issue;
};

const getStats = async () => {
    return await issueRepository.countIssuesByStatus();
};

module.exports = { getAllIssues, updateIssueStatus, getStats };
