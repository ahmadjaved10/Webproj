import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const PromotionForm = () => {
    const [promotionData, setPromotionData] = useState({
        title: '',
        discountPercentage: '',
        description: '',
        status: 'Active', // Default value
    });

    const location = useLocation();
    const navigate = useNavigate(); // For navigation after submission
    const editMode = new URLSearchParams(location.search).get('edit'); // Check if in edit mode

    useEffect(() => {
        if (editMode) {
            const fetchPromotionDetails = async () => {
                try {
                    const response = await API.get(`/promotions/${editMode}`); // Fetch promotion by ID
                    setPromotionData(response.data); // Populate form with fetched data
                } catch (error) {
                    console.error('Error fetching promotion details:', error);
                    alert('Failed to fetch promotion details');
                }
            };
            fetchPromotionDetails();
        }
    }, [editMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromotionData({ ...promotionData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (promotionData._id) {
                await API.put(`/promotions/${promotionData._id}`, promotionData); // Update existing promotion
                alert('Promotion updated successfully');
            } else {
                await API.post('/promotions', promotionData); // Create new promotion
                alert('Promotion created successfully');
            }
            navigate('/promotions'); // Navigate back to promotions list after success
        } catch (error) {
            console.error('Error submitting promotion:', error);
            alert('Failed to submit promotion');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{promotionData._id ? 'Edit Promotion' : 'Create Promotion'}</h2>
            <div className="mb-3">
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={promotionData.title || ''}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label>Discount Percentage:</label>
                <input
                    type="number"
                    name="discountPercentage"
                    className="form-control"
                    value={promotionData.discountPercentage || ''}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label>Description:</label>
                <textarea
                    name="description"
                    className="form-control"
                    value={promotionData.description || ''}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label>Status:</label>
                <select
                    name="status"
                    className="form-select"
                    value={promotionData.status || 'Active'}
                    onChange={handleChange}
                >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary">{promotionData._id ? 'Update Promotion' : 'Create Promotion'}</button>
        </form>
    );
};

export default PromotionForm;