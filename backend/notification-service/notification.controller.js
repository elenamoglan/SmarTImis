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
  },

  createSystemNotification: async (req, res, next) => {
      try {
          // In a real app, verify that the request is coming from an internal trusted microservice.
          const { user_id, report_id, message } = req.body;
          if (!user_id || !message) {
              return res.status(400).json({ error: "user_id and message are required" });
          }
          const notification = await NotificationService.createNotification(user_id, report_id, message);
          res.status(201).json(notification);
      } catch (err) {
          next(err);
      }
  }
};

module.exports = NotificationController;
