import React, { useState, useEffect } from 'react';
import API from '../../services/api';  // Axios instance for backend requests

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get('/notifications');  // Assuming /notifications endpoint
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            {notification.type}: {notification.message} - Read: {notification.isRead ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsList;
