import React, { useState, useEffect } from 'react';
import API from '../../services/api';

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
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order._id}</p>
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
  );
};

export default OrderDetails;
