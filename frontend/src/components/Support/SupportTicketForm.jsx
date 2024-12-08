import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const SupportTicketForm = () => {
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get ticket ID from query params
  const queryParams = new URLSearchParams(location.search);
  const ticketId = queryParams.get('id');

  // Fetch ticket data if editing
  useEffect(() => {
    if (ticketId) {
      setIsEditing(true);
      const fetchTicketData = async () => {
        try {
          const response = await API.get(`/support/${ticketId}`);
          setTicketData({
            subject: response.data.subject,
            description: response.data.description,
          });
        } catch (error) {
          console.error('Error fetching support ticket:', error);
          setMessage('Error fetching ticket data');
        }
      };
      fetchTicketData();
    }
  }, [ticketId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update an existing ticket
        await API.put(`/support/${ticketId}`, ticketData);
        setMessage('Ticket updated successfully!');
      } else {
        // Create a new ticket
        await API.post('/support', ticketData);
        setMessage('Ticket created successfully!');
      }
      navigate('/support'); // Redirect to support list after submission
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      setMessage('Failed to submit ticket');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
      <h2 className="mb-3">{isEditing ? 'Edit Support Ticket' : 'Create Support Ticket'}</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <label htmlFor="subject" className="form-label">Subject:</label>
        <input
          id="subject"
          type="text"
          name="subject"
          className="form-control"
          value={ticketData.subject}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description:</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          value={ticketData.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">{isEditing ? 'Update Ticket' : 'Create Ticket'}</button>
    </form>
  );
};

export default SupportTicketForm;