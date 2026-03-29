const issueRepository = require('./issue.repository');
const redisClient = require('./redis');

const createIssue = async (issueData) => {
  const issue = await issueRepository.createIssue(issueData);
  // Clear cache when new issue is created
  await redisClient.del('all_issues_cache');
  return issue;
};

const getIssues = async (page = 1, limit = 20, status) => {
  const offset = (page - 1) * limit;

  // Try caching only for the first page without filters as it's the most common hit
  if (page === 1 && limit === 20 && !status) {
      const cachedIssues = await redisClient.get('all_issues_cache');
      if (cachedIssues) {
          return JSON.parse(cachedIssues);
      }

      const issues = await issueRepository.findAllIssues(limit, offset, status);
      await redisClient.setEx('all_issues_cache', 60, JSON.stringify(issues)); // Cache for 60 seconds
      return issues;
  }

  return await issueRepository.findAllIssues(limit, offset, status);
};

const getIssueById = async (id) => {
  const issue = await issueRepository.findIssueById(id);
  if (!issue) {
    throw new Error('Issue not found');
  }
  return issue;
};

const getUserIssues = async (userId) => {
  return await issueRepository.findIssuesByUserId(userId);
};

const likeIssue = async (userId, issueId) => {
    const result = await issueRepository.likeIssue(userId, issueId);
    // Invalidate cache
    await redisClient.del('all_issues_cache');
    return result;
};

module.exports = { createIssue, getIssues, getIssueById, getUserIssues, likeIssue };
