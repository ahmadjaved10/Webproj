// NotificationsList.jsx
import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import NotificationForm from './NotificationForm';
import API from '../services/api';
import '../styles/components/notifications.css';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await API.get('/notifications');
      setNotifications(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications');
    }
  };

  const toggleForm = () => setShowForm(!showForm);

  return (
    <div className="notifications-list">
      {error && <div className="error-message">{error}</div>}
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      <button onClick={toggleForm} className="create-notification-btn">
        Create New Notification
      </button>
      {showForm && (
        <NotificationForm
          onSubmitSuccess={(newNotification) => {
            setNotifications([...notifications, newNotification]);
            toggleForm();
          }}
          onClose={toggleForm}
        />
      )}
    </div>
  );
};

export default NotificationsList;
