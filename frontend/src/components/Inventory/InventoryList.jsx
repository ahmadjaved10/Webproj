import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const InventoryList = () => {
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventoryLogs = async () => {
      try {
        const response = await API.get('/inventory');
        setInventoryLogs(response.data);
      } catch (error) {
        console.error('Error fetching inventory logs:', error);
        setError('Failed to load inventory logs.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventoryLogs();
  }, []);

  const deleteInventoryLog = async (id) => {
      try {
          await API.delete(`/inventory/${id}`);
          setInventoryLogs(inventoryLogs.filter((log) => log._id !== id));
      } catch (error) {
          console.error('Error deleting inventory log:', error);
          setError('Failed to delete the inventory log. Please try again.');
      }
  };

  if (loading) return <div>Loading inventory logs...</div>;
  if (error) return <div>{error}</div>;

  return (
      <div className="container mt-4">
          <h2>Inventory List</h2>
          <Link to="/inventory/form" className="btn btn-primary mb-3">Create New Inventory Log</Link>
          {inventoryLogs.length === 0 ? (
              <p>No inventory logs found.</p>
          ) : (
              <ul className="list-group">
                  {inventoryLogs.map((log) => (
                      <li key={log._id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                              Product ID: {log.productId} - Change Quantity: {log.changeQuantity} - Change Type: {log.changeType}
                          </div>
                          <div>
                              {/* Link to edit form with log ID */}
                              <Link to={`/inventory/form?edit=${log._id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                              <button 
                                  className="btn btn-danger btn-sm" 
                                  onClick={() => deleteInventoryLog(log._id)}
                              >
                                  Delete
                              </button>
                          </div>
                      </li>
                  ))}
              </ul>
          )}
      </div>
  );
};

export default InventoryList;