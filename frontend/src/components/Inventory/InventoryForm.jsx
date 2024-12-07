// InventoryForm.jsx
import React, { useState } from 'react';
import API from '../services/api';
import '../styles/components/inventory.css';

const InventoryForm = ({ initialData = {}, onSuccess }) => {
  const [inventoryData, setInventoryData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventoryData({ ...inventoryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (inventoryData._id) {
        await API.put(`/inventory/${inventoryData._id}`, inventoryData);
      } else {
        await API.post('/inventory', inventoryData);
      }
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error submitting inventory:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inventory-form">
      <h2>{inventoryData._id ? 'Edit Inventory' : 'Update Inventory'}</h2>
      <div className="form-group">
        <label>Product ID:</label>
        <input
          type="text"
          name="productId"
          value={inventoryData.productId || ''}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Change Quantity:</label>
        <input
          type="number"
          name="changeQuantity"
          value={inventoryData.changeQuantity || ''}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default InventoryForm;
