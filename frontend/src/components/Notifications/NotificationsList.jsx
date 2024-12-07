import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import NotificationForm from './NotificationForm';
import API from '../services/api';
import '../styles/components/notifications.css';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);  // New state for viewing notifications
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
  const toggleShowAllNotifications = () => setShowAllNotifications(!showAllNotifications);  // Toggle to view all notifications

  return (
    <div className="notifications-container">
      <div className="notifications-list">
        <h2>Notifications</h2>
        {error && <div className="error-message">{error}</div>}
        
        {/* Show all notifications when the state is true */}
        {showAllNotifications && notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}

        {/* Button to view notifications */}
        <button
          onClick={toggleShowAllNotifications}
          className="view-notifications-btn"
        >
          {showAllNotifications ? 'Hide Notifications' : 'View All Notifications'}
        </button>

        {/* Button to create a new notification */}
        <button
          onClick={toggleForm}
          className="create-notification-btn"
        >
          Create New Notification
        </button>
      </div>

      {/* Bootstrap Modal */}
      {showForm && (
        <div className={`modal fade show`} tabIndex="-1" aria-hidden="false" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Notification</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleForm}
                ></button>
              </div>
              <div className="modal-body">
                <NotificationForm
                  onSubmitSuccess={(newNotification) => {
                    setNotifications([...notifications, newNotification]);
                    toggleForm(); // Close the modal on success
                  }}
                  onClose={toggleForm}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
