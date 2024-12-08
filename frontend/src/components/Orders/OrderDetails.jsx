import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useParams } from 'react-router-dom'; // Import useParams
import '../styles/components/order.css';

const OrderDetails = () => {
    const { orderId } = useParams(); // Use useParams to get orderId from URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await API.get(`/orders/${orderId}`); // Fetch using orderId
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Failed to fetch order details.');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrderDetails(); // Only fetch if orderId is available
    }, [orderId]);

    const handleDelete = async () => {
        try {
            await API.delete(`/orders/${orderId}`);
            alert('Order deleted successfully');
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!order) return <div>No order found.</div>;

    return (
        <div className="notifications-container">
            <div className="notifications-list">
                <h2>Order Details</h2>
                <div className="order-notifications">
                    <div className="notification-item">
                        <h3>Order ID: {order._id}</h3>
                        <p>Status: {order.orderStatus}</p>
                        <p>Total Amount: ${order.totalAmount}</p>
                        <h3>Products:</h3>
                        <ul>
                            {order.products.map((product) => (
                                <li key={product.productId}>
                                    {product.productId.name} - Quantity: {product.quantity} - Price: ${product.price}
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleDelete} className="btn btn-danger">Delete Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;