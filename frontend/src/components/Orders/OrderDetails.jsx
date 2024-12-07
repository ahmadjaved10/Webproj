import React, { useState, useEffect } from 'react';
import API from '../services/api';
import '../styles/components/order.css';
const OrderDetails = ({ orderId }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await API.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="notifications-container">
      <div className="notifications-list">
        <h2>Order Details</h2>
        <div className="order-notifications">
          <div className="notification-item">
            <h3>Order ID: {order._id}</h3>
            <p>Status: {order.orderStatus}</p>
            <p>Total Amount: ${order.totalAmount}</p>
            <h3>Products:</h3>
            <ul>
              {order.products.map((product) => (
                <li key={product.productId}>
                  {product.name} - Quantity: {product.quantity} - Price: ${product.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
