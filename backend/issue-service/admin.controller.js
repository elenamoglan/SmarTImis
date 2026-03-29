const adminService = require('./admin.service');

const getIssues = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const issues = await adminService.getAllIssues(page || 1, limit || 50, status);
    res.json(issues);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const issue = await adminService.updateIssueStatus(id, status);
    res.json(issue);
  } catch (error) {
    if (error.message === 'Issue not found') {
      res.status(404);
    } else if (error.message === 'Invalid status') {
      res.status(400);
    }
    next(error);
  }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await adminService.getStats();
        res.json(stats);
    } catch (error) {
        next(error);
    }
}

module.exports = { getIssues, updateStatus, getStats };
