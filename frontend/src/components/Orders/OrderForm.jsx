import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLocation } from 'react-router-dom';

const OrderForm = () => {
    const [orderData, setOrderData] = useState({
        customerName: '',
        totalAmount: '',
        orderStatus: 'Pending', // Default value
        // Add other fields as needed
    });
    
    const location = useLocation();
    const editMode = new URLSearchParams(location.search).get('edit'); // Check if in edit mode

    useEffect(() => {
        if (editMode) {
            const fetchOrderDetails = async () => {
                try {
                    const response = await API.get(`/orders/${editMode}`); // Fetch order by ID
                    setOrderData(response.data); // Set fetched data to state
                } catch (error) {
                    console.error('Error fetching order details:', error);
                }
            };
            fetchOrderDetails();
        }
    }, [editMode]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editMode) {
                // Update existing order
                await API.put(`/orders/${editMode}`, orderData);
                alert('Order updated successfully');
            } else {
                // Create new order
                await API.post('/orders', orderData);
                alert('Order created successfully');
            }
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setOrderData({ ...orderData, [name]: value });
    };

    return (
        <div className="container mt-4">
            <h2>{editMode ? 'Edit Order' : 'Create New Order'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="customerName" className="form-label">Customer Name</label>
                    <input type="text" className="form-control" id="customerName" name="customerName" value={orderData.customerName} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="totalAmount" className="form-label">Total Amount</label>
                    <input type="number" className="form-control" id="totalAmount" name="totalAmount" value={orderData.totalAmount} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="orderStatus" className="form-label">Order Status</label>
                    <select className="form-select" id="orderStatus" name="orderStatus" value={orderData.orderStatus} onChange={handleChange}>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                {/* Add more fields as needed */}
                <button type="submit" className="btn btn-primary">{editMode ? 'Update Order' : 'Create Order'}</button>
            </form>
        </div>
    );
};

export default OrderForm;