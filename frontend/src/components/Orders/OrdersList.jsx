import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import API from '../services/api';
import '../styles/components/order.css';

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

  // Sorting orders by totalAmount
  const sortedOrders = orders.sort((a, b) => a.totalAmount - b.totalAmount);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Orders List</h2>

      {/* Button to navigate to the order creation form */}
      <div className="text-center mb-3">
        <Link to="/orders/form" className="btn btn-primary">Create New Order</Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <ul className="list-group">
          {sortedOrders.map((order) => (
            <li key={order._id} className="list-group-item">
              <strong>Order ID:</strong> {order._id} - 
              <strong> Total:</strong> ${order.totalAmount} - 
              <strong> Status:</strong> {order.orderStatus}
              <div className="mt-2">
                {/* Link to the order details */}
                <Link to={`/orders/${order._id}`} className="btn btn-info btn-sm me-2">View Details</Link>
                {/* Link to the order form for editing */}
                <Link to={`/orders/form?edit=${order._id}`} className="btn btn-warning btn-sm">Edit Order</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersList;
