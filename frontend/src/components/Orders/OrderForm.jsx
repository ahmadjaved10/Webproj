import React, { useState } from 'react';
import API from '../services/api';

const OrderForm = () => {
  const [orderData, setOrderData] = useState({
    customerName: '',
    totalAmount: '',
    orderStatus: '',
    // Add other fields as needed
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await API.post('/orders', orderData);
      console.log('Order created:', response.data);
      // Redirect or show success message
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOrderData({
      ...orderData,
      [name]: value,
    });
  };

  return (
    <div className="container mt-4">
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="customerName" className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            id="customerName"
            name="customerName"
            value={orderData.customerName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="totalAmount" className="form-label">Total Amount</label>
          <input
            type="number"
            className="form-control"
            id="totalAmount"
            name="totalAmount"
            value={orderData.totalAmount}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="orderStatus" className="form-label">Order Status</label>
          <input
            type="text"
            className="form-control"
            id="orderStatus"
            name="orderStatus"
            value={orderData.orderStatus}
            onChange={handleChange}
          />
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="btn btn-primary">Create Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
