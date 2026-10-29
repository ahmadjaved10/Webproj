// NotificationForm.jsx
import React, { useState } from 'react';
import API from '../services/api';


const NotificationForm = () => {
  const [type, setType] = useState('Order Alert');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await API.post('/notifications', { type, message });
      console.log('Notification created:', response.data);
      alert('Notification created successfully!');
      setMessage('');
    } catch (error) {
      console.error('Failed to create notification:', error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create notification.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="notification-form">
      {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="Order Alert">Order Alert</option>
          <option value="Low Stock Alert">Low Stock Alert</option>
          <option value="Promotional Reminder">Promotional Reminder</option>
        </select>
      </label>
      <label>
        Message:
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={1}
        />
      </label>
      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Notification'}
      </button>
    </form>
  );
};

export default NotificationForm;
