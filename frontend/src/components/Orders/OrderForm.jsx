// OrderForm.jsx
import React, { useState } from 'react';
import API from '../services/api';

const OrderForm = ({ initialData = {}, onSuccess }) => {
  const [orderData, setOrderData] = useState({
    products: initialData.products || '',
    totalAmount: initialData.totalAmount || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData._id) {
        // Update an existing order
        await API.put(`/orders/${initialData._id}`, orderData);
      } else {
        // Create a new order
        await API.post('/orders', orderData);
      }
      if (onSuccess) onSuccess(); // Notify parent about successful submission
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData._id ? 'Edit Order' : 'Create Order'}</h2>
      <div>
        <label>Products:</label>
        <input
          type="text"
          name="products"
          value={orderData.products}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Total Amount:</label>
        <input
          type="number"
          name="totalAmount"
          value={orderData.totalAmount}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default OrderForm;
