const NotificationRepository = require('./notification.repository');

const NotificationService = {
  createNotification: async (userId, reportId, message) => {
    return await NotificationRepository.create(userId, reportId, message);
  },

  getUserNotifications: async (userId) => {
    return await NotificationRepository.findByUser(userId);
  },
  
  markAsRead: async (id) => {
      return await NotificationRepository.markAsRead(id);
  }
};

module.exports = NotificationService;
