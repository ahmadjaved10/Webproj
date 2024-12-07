import React, { useState, useEffect } from 'react';
import API from '../services/api';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('/orders');
        setOrders(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
        } else {
          setError('Error fetching orders: ' + (error.message || 'Unknown error'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Orders List</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              Order ID: {order._id} - Total: ${order.totalAmount} - Status: {order.orderStatus}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersList;
