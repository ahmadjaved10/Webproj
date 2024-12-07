// SupportTicketForm.jsx
import React, { useState } from 'react';
import API from '../services/api';

const SupportTicketForm = ({ initialData = {}, onSuccess }) => {
  const [ticketData, setTicketData] = useState({
    subject: initialData.subject || '',
    description: initialData.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData._id) {
        // Update an existing ticket
        await API.put(`/support${initialData._id}`, ticketData);
      } else {
        // Create a new ticket
        await API.post('/support', ticketData);
      }
      if (onSuccess) onSuccess(); // Notify parent about successful submission
    } catch (error) {
      console.error('Error submitting support ticket:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData._id ? 'Edit Support Ticket' : 'Create Support Ticket'}</h2>
      <div>
        <label htmlFor="subject">Subject:</label>
        <input
          id="subject"
          type="text"
          name="subject"
          value={ticketData.subject}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={ticketData.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SupportTicketForm;
