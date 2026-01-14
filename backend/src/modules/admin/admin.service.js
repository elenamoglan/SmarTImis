const issueRepository = require('../issues/issue.repository');
const notificationService = require('../notifications/notification.service');

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

  // Trigger Notification
  // Note: issue object needs to contain user_id to know who to notify. 
  // ensure updateIssueStatus returns user_id or fetch it.
  if (issue.user_id) {
      await notificationService.createNotification(
          issue.user_id,
          issue.id,
          `Your report "${issue.title}" status has been updated to ${status}.`
      );
  }

  return issue;
};

const getStats = async () => {
    return await issueRepository.countIssuesByStatus();
};

module.exports = { getAllIssues, updateIssueStatus, getStats };
