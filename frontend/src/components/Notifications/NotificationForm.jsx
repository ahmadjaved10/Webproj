import React, { useState } from 'react';
import API from '../../services/api';

const NotificationForm = () => {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const notificationData = {
        type,
        message,
      };
      await API.post('/notifications', notificationData); // Assuming a POST request to create a new notification
      alert('Notification created successfully!');
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return (
    <div>
      <h3>Create Notification</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Notification Type:
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </label>
        <br />
        <label>
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Notification</button>
      </form>
    </div>
  );
};

export default NotificationForm;
