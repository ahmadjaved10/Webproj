// SupportTicketList.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';

const SupportTicketList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await API.get('/support');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching support tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Support Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>{ticket.subject}</li>
        ))}
      </ul>
    </div>
  );
};

export default SupportTicketList;
