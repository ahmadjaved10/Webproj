import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/components/order.css';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await API.get('/orders');
                setOrders(response.data);
            } catch (error) {
                setError(error.response?.status === 401 ? 'Unauthorized access. Please log in again.' : `Error fetching orders: ${error.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, []);

    const deleteOrder = async (id) => {
        try {
            await API.delete(`/orders/${id}`);
            setOrders(orders.filter((order) => order._id !== id));
        } catch (error) {
            console.error('Error deleting order:', error);
            setError('Failed to delete the order. Please try again.');
        }
    };

    const editOrder = (id) => navigate(`/orders/form?edit=${id}`);
    
    const viewOrder = (id) => navigate(`/orders/${id}`);

    if (loading) return <div>Loading orders...</div>;
    
    if (error) return <div>{error}</div>;

    const sortedOrders = orders.sort((a, b) => a.totalAmount - b.totalAmount);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Orders List</h2>
            <div className="text-center mb-4">
                <Link to="/orders/form" className="btn btn-primary btn-lg">Create New Order</Link>
            </div>
            
            {orders.length === 0 ? (
                <p className="text-center">No orders found.</p>
            ) : (
                <ul className="list-group">
                    {sortedOrders.map((order) => (
                        <li key={order._id} className="list-group-item d-flex justify-content-between align-items-center p-3 mb-3 shadow-sm rounded">
                            <div>
                                <strong>Order ID:</strong> {order._id} -{' '}
                                <strong>Total:</strong> ${order.totalAmount} -{' '}
                                <strong>Status:</strong> {order.orderStatus}
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-info btn-sm" onClick={() => viewOrder(order._id)}>View Details</button>
                                <button className="btn btn-warning btn-sm" onClick={() => editOrder(order._id)}>Edit Order</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteOrder(order._id)}>Delete Order</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrdersList;
