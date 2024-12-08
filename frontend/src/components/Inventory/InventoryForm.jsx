import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const InventoryForm = () => {
    const [inventoryData, setInventoryData] = useState({
        productId: '',
        changeQuantity: '',
        changeType: 'Add', // Default change type
    });

    const location = useLocation();
    const navigate = useNavigate(); // For navigation after submission
    const editMode = new URLSearchParams(location.search).get('edit'); // Check if in edit mode

    useEffect(() => {
        if (editMode) {
            const fetchInventoryDetails = async () => {
                try {
                    const response = await API.get(`/inventory/${editMode}`); // Fetch inventory by ID
                    setInventoryData(response.data); // Populate form with fetched data
                } catch (error) {
                    console.error('Error fetching inventory details:', error);
                    alert('Failed to fetch inventory details');
                }
            };
            fetchInventoryDetails();
        }
    }, [editMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInventoryData({ ...inventoryData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (inventoryData._id) {
                await API.put(`/inventory/${inventoryData._id}`, inventoryData); // Update existing inventory log
                alert('Inventory updated successfully');
            } else {
                await API.post('/inventory', inventoryData); // Create new inventory log
                alert('Inventory created successfully');
            }
            navigate('/inventory'); // Navigate back to inventory list after success
        } catch (error) {
            console.error('Error submitting inventory:', error);
            alert('Failed to submit inventory');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{inventoryData._id ? 'Edit Inventory' : 'Create Inventory'}</h2>
            <div className="mb-3">
                <label>Product ID:</label>
                <input
                    type="text"
                    name="productId"
                    className="form-control"
                    value={inventoryData.productId || ''}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label>Change Quantity:</label>
                <input
                    type="number"
                    name="changeQuantity"
                    className="form-control"
                    value={inventoryData.changeQuantity || ''}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label>Change Type:</label>
                <select 
                  name="changeType" 
                  className="form-select" 
                  value={inventoryData.changeType} 
                  onChange={handleChange}
                  required 
                  >
                  <option value="Add">Add</option>
                  <option value="Remove">Remove</option>
                  <option value="Restock">Restock</option>
              </select>
          </div>
          <button type="submit" className="btn btn-primary">{inventoryData._id ? 'Update Inventory' : 'Create Inventory'}</button>
      </form>
  );
};

export default InventoryForm;