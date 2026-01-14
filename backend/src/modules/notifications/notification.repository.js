const pool = require('../../config/db');

const NotificationRepository = {
  create: async (userId, reportId, message) => {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, report_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, reportId, message]
    );
    return result.rows[0];
  },

  findByUser: async (userId) => {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },
  
  markAsRead: async (id) => {
      const result = await pool.query(
          `UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *`,
          [id]
      );
      return result.rows[0];
  }
};

module.exports = NotificationRepository;
