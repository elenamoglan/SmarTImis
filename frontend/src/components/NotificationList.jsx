import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Simple polling every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
      <div className="relative">
        <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-white hover:bg-blue-700 rounded-full transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center border border-blue-600">
            {unreadCount}
          </span>
          )}
        </button>

        {showDropdown && (
            <>
              <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setShowDropdown(false)}
              ></div>
              {/* UPDATED LINE BELOW:
              Changed 'left-full top-0 ml-2' to 'bottom-full left-0 mb-2'
              - bottom-full: Pushes the element up by 100% of its height.
              - left-0: Aligns it with the left edge of the bell container.
              - mb-2: Adds margin to the bottom so it doesn't touch the bell.
          */}
              <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden">
                <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
                  <button
                      onClick={fetchNotifications}
                      className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Refresh
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No notifications
                      </div>
                  ) : (
                      <ul>
                        {notifications.map(notification => (
                            <li
                                key={notification.id}
                                className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50' : ''}`}
                            >
                              <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                              <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                                {!notification.is_read && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="text-xs text-blue-600 font-medium hover:underline"
                                    >
                                      Mark read
                                    </button>
                                )}
                              </div>
                            </li>
                        ))}
                      </ul>
                  )}
                </div>
              </div>
            </>
        )}
      </div>
  );
};

export default NotificationList;