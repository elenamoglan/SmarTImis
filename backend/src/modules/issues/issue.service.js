const issueRepository = require('./issue.repository');

const createIssue = async (issueData) => {
  return await issueRepository.createIssue(issueData);
};

const getIssues = async (page = 1, limit = 20, status) => {
  const offset = (page - 1) * limit;
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
    return await issueRepository.likeIssue(userId, issueId);
};

module.exports = { createIssue, getIssues, getIssueById, getUserIssues, likeIssue };
