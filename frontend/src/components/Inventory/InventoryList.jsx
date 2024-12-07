// InventoryList.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import '../styles/components/inventory.css';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await API.get('/inventory');
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="inventory-list">
      <h2>Inventory List</h2>
      <ul className="inventory-items">
        {inventory.map((item) => (
          <li key={item._id} className="inventory-item">
            {item.productId} - {item.changeQuantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryList;
