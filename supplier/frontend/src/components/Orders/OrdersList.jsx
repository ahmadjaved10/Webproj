import React, { useState, useEffect } from 'react';
import API from '../../services/api';  // Axios instance to communicate with backend

const OrdersList = () => {
  const [orders, setOrders] = useState([]); // State to store the list of orders
  const [loading, setLoading] = useState(true); // State to track the loading status
  const [error, setError] = useState(null); // State to store any error message

  useEffect(() => {
    // Fetching orders from backend when the component mounts
    const fetchOrders = async () => {
      try {
        const response = await API.get('/orders');  // Adjust the endpoint as needed
        setOrders(response.data);  // Save orders data to state
      } catch (error) {
        setError('Error fetching orders: ' + error.message);  // Set error state
      } finally {
        setLoading(false);  // Set loading to false once data fetching is done
      }
    };

    fetchOrders();
  }, []);  // Empty dependency array ensures this runs only once when component mounts

  // Render loading spinner, error message, or orders list
  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Orders List</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>  // Handle case when there are no orders
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
