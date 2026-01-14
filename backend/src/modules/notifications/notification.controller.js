const NotificationService = require('./notification.service');

const NotificationController = {
  getMyNotifications: async (req, res, next) => {
    try {
      const notifications = await NotificationService.getUserNotifications(req.user.id);
      res.json(notifications);
    } catch (err) {
      next(err);
    }
  },
  
  markRead: async (req, res, next) => {
      try {
          const { id } = req.params;
          // In a real app, verify ownership first
          const updated = await NotificationService.markAsRead(id);
          res.json(updated);
      } catch (err) {
          next(err);
      }
  }
};

module.exports = NotificationController;
