import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const SupportTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await API.get('/support');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching support tickets:', error);
        setMessage('Error fetching tickets');
      }
    };
    
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await API.delete(`/support/${id}`);
        setTickets(tickets.filter(ticket => ticket._id !== id));
        setMessage('Ticket deleted successfully!');
      } catch (error) {
        console.error('Error deleting support ticket:', error);
        setMessage('Failed to delete ticket');
      }
    }
  };

  return (
    <div className="p-4">
      <h2>Support Tickets</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <Link to="/support/form" className="btn btn-success mb-3">Create New Ticket</Link>
      <ul className="list-group">
        {tickets.map((ticket) => (
          <li key={ticket._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{ticket.subject}</span>
            <div>
              {/* Navigate to detail view */}
              <Link to={`/support/${ticket._id}`} className="btn btn-info btn-sm me-2">View</Link>
              {/* Navigate to edit form */}
              <Link to={`/support/form?id=${ticket._id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
              <button onClick={() => handleDelete(ticket._id)} className="btn btn-danger btn-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupportTicketList;