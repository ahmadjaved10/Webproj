// NotificationForm.jsx
import React, { useState } from 'react';
import API from '../services/api';


const NotificationForm = () => {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/notifications', { type, message });
      console.log('Notification created:', response.data);
      alert('Notification created successfully!');
    } catch (error) {
      console.error('Failed to create notification:', error.response?.data || error.message);
      alert('Failed to create notification');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="notification-form">
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Order Alert">Order Alert</option>
          <option value="Low Stock Alert">Low Stock Alert</option>
          <option value="Promotional Reminder">Promotional Reminder</option>
        </select>
      </label>
      <label>
        Message:
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <button type="submit" className="submit-btn">Create Notification</button>
    </form>
  );
};

export default NotificationForm;
