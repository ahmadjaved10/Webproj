import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/components/order.css';

const CUSTOMER_ORDER_TRANSITIONS = {
    Placed: ['Accepted', 'Cancelled'],
    Accepted: ['Preparing', 'Cancelled'],
    Preparing: ['Ready', 'Cancelled'],
    Ready: ['Completed', 'Cancelled'],
    Completed: [],
    Cancelled: [],
};

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerOrderError, setCustomerOrderError] = useState('');
    const [notice, setNotice] = useState('');
    const navigate = useNavigate();

    const fetchOrders = useCallback(async (showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const [supplierOrdersResponse, customerOrdersResponse] = await Promise.all([
                API.get('/orders'),
                API.get('/orders/customer-orders'),
            ]);
            setOrders(supplierOrdersResponse.data);
            setCustomerOrders(customerOrdersResponse.data.orders);
            setError(null);
            setCustomerOrderError('');
        } catch (requestError) {
            console.error('Error fetching supplier orders:', requestError);
            const message = requestError.response?.data?.message || requestError.message || 'Unable to load orders.';
            setError(message);
            setCustomerOrderError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(true);
        const refreshTimer = window.setInterval(() => fetchOrders(), 15000);
        return () => window.clearInterval(refreshTimer);
    }, [fetchOrders]);

    const updateCustomerOrderStatus = async (orderId, status) => {
        setNotice('');
        setCustomerOrderError('');
        try {
            await API.patch(`/orders/customer-orders/${orderId}/status`, { status });
            setNotice(`Order ${orderId} updated to ${status === 'Completed' ? 'Delivered' : status}.`);
            await fetchOrders();
        } catch (requestError) {
            console.error('Error updating customer order:', requestError);
            setCustomerOrderError(requestError.response?.data?.message || 'Unable to update this customer order.');
        }
    };

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

    const sortedOrders = orders.sort((a, b) => a.totalAmount - b.totalAmount);

    return (
        <div className="container mt-4">
            <section className="page-shell" aria-labelledby="customer-orders-title">
                <h2 id="customer-orders-title">Customer orders for your products</h2>
                <p>These orders contain only products belonging to your supplier account. Status changes are shown to the customer in their order history.</p>
                <button type="button" className="btn btn-outline-success mb-3" onClick={() => fetchOrders(true)}>
                    Refresh customer orders
                </button>
                {customerOrderError && <p className="alert alert-danger" role="alert">{customerOrderError}</p>}
                {notice && <p className="alert alert-success" role="status">{notice}</p>}
                {!customerOrderError && customerOrders.length === 0 && (
                    <p>No customer orders for your products yet.</p>
                )}
                <div className="list-group">
                    {customerOrders.map((order) => (
                        <article className="list-group-item" key={order._id}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h3 className="h5">Order {order._id}</h3>
                                    <p className="mb-1">
                                        Customer: {order.customerId?.name || 'Customer'} ({order.customerId?.email || 'account removed'})
                                    </p>
                                    <p className="mb-1">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <strong>{order.status === 'Completed' ? 'Delivered' : order.status}</strong>
                            </div>
                            <ul>
                                {order.items.map((item) => (
                                    <li key={`${order._id}-${item.productId}`}>
                                        {item.productName} × {item.quantity} — ${Number(item.lineTotal).toFixed(2)}
                                        {item.discountPercentage > 0 && ` (${item.discountPercentage}% discount)`}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Total: ${Number(order.totalAmount).toFixed(2)}</strong> · {order.paymentMethod}</p>
                            <p>Pickup/delivery address: {order.deliveryAddress}</p>
                            {order.customerNote && <p>Customer note: {order.customerNote}</p>}
                            <label className="d-flex align-items-center gap-2">
                                Update status
                                <select
                                    className="form-select"
                                    style={{ maxWidth: '220px' }}
                                    value=""
                                    onChange={(event) => updateCustomerOrderStatus(order._id, event.target.value)}
                                >
                                    <option value="" disabled>{order.status === 'Completed' ? 'Delivered' : order.status}</option>
                                    {(CUSTOMER_ORDER_TRANSITIONS[order.status] || []).map((status) => (
                                        <option key={status} value={status}>{status === 'Completed' ? 'Delivered' : status}</option>
                                    ))}
                                </select>
                            </label>
                        </article>
                    ))}
                </div>
            </section>

            {error && <div className="alert alert-danger" role="alert">{error}</div>}
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
