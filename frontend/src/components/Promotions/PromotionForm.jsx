// PromotionForm.jsx
import React, { useState } from 'react';
import API from '../services/api';

const PromotionForm = ({ initialData = {}, onSuccess }) => {
  const [promotionData, setPromotionData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotionData({ ...promotionData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (promotionData._id) {
        await API.put(`/promotions/${promotionData._id}`, promotionData);
      } else {
        await API.post('/promotions', promotionData);
      }
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error submitting promotion:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{promotionData._id ? 'Edit Promotion' : 'Create Promotion'}</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={promotionData.title || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Discount Percentage:</label>
        <input
          type="number"
          name="discountPercentage"
          value={promotionData.discountPercentage || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={promotionData.description || ''}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PromotionForm;
