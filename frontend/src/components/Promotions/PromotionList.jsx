// PromotionList.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';

const PromotionList = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await API.get('/promotions');
        setPromotions(response.data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };
    fetchPromotions();
  }, []);

  return (
    <div>
      <h2>Promotions List</h2>
      <ul>
        {promotions.map((promotion) => (
          <li key={promotion._id}>{promotion.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default PromotionList;
