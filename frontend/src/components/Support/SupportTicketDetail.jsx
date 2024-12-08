import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const SupportTicketDetail = () => {
  const { id } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await API.get(`/support/${id}`);
        setTicketData(response.data);
      } catch (error) {
        console.error('Error fetching support ticket:', error);
      }
    };
    
    fetchTicketData();
  }, [id]);

  return (
    <div className="p-4">
      <h2>Support Ticket Detail</h2>
      {ticketData ? (
        <div>
          <h3>{ticketData.subject}</h3>
          <p>{ticketData.description}</p>
          <button className="btn btn-warning" onClick={() => navigate(`/support/form?id=${ticketData._id}`)}>Edit</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SupportTicketDetail;