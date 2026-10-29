import React, { useCallback, useEffect, useState } from 'react';
import API from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import '../styles/components/customer.css';
import '../styles/components/customer-order-status.css';

const ORDER_STEPS = [
  { status: 'Placed', label: 'Placed' },
  { status: 'Accepted', label: 'Confirmed' },
  { status: 'Preparing', label: 'Preparing' },
  { status: 'Ready', label: 'Ready' },
  { status: 'Completed', label: 'Delivered' },
];

const ORDER_MESSAGES = {
  Placed: 'Your order has been placed and is waiting for supplier confirmation.',
  Accepted: 'Your order was accepted and will be prepared.',
  Preparing: 'Your order is being prepared.',
  Ready: 'Your order is ready for pickup or delivery.',
  Completed: 'Your order has been delivered.',
  Cancelled: 'This order was cancelled.',
};

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const fetchOrders = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setError('');
    try {
      const response = await API.get('/customers/orders');
      setOrders(response.data.orders);
    } catch (requestError) {
      console.error('Could not load customer orders', requestError);
      setError(requestError.response?.data?.message || 'Unable to load your orders.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(true);
    const refreshTimer = window.setInterval(() => fetchOrders(), 15000);
    return () => window.clearInterval(refreshTimer);
  }, [fetchOrders]);

  return (
    <main className="customer-page">
      <div className="customer-page-heading">
        <div>
          <p className="customer-eyebrow">Your account</p>
          <h1>Order history</h1>
        </div>
        <div>
          <button type="button" className="customer-orders-refresh" onClick={() => fetchOrders(true)}>
            Refresh status
          </button>{' '}
          <Link className="customer-button" to="/shop">Start an order</Link>
        </div>
      </div>
      {location.state?.createdOrderIds?.length > 0 && (
        <section className="customer-notice" role="status" aria-label="New supplier orders">
          <strong>Your order has been sent to these suppliers:</strong>
          <ul className="customer-created-orders">
            {(location.state.createdOrders || location.state.createdOrderIds.map((id) => ({ id, supplierName: 'Supplier' }))).map((order) => (
              <li key={order.id}>
                <strong>{order.supplierName}</strong> — order {order.id}
              </li>
            ))}
          </ul>
        </section>
      )}
      {location.state?.notificationWarning && (
        <p className="customer-error" role="alert">{location.state.notificationWarning}</p>
      )}
      {error && <p className="customer-error" role="alert">{error}</p>}
      {isLoading && <p>Loading your orders...</p>}
      {!isLoading && !error && orders.length === 0 && <p>You have not placed any orders yet.</p>}
      <div className="customer-order-list">
        {orders.map((order) => (
          <article className="customer-order-card" key={order._id}>
            <header>
              <div>
                <p className="customer-eyebrow">Supplier order</p>
                <h2>From {order.supplierName || 'Supplier'}</h2>
                <p>Order number: {order._id}</p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className={`customer-order-status status-${order.status.toLowerCase()}`}>
                {order.status === 'Completed' ? 'Delivered' : order.status}
              </span>
            </header>
            <p className="customer-order-status-message" role="status">{ORDER_MESSAGES[order.status] || `Order status: ${order.status}`}</p>
            {order.status !== 'Cancelled' && (
              <ol className="customer-order-progress" aria-label="Order progress">
                {ORDER_STEPS.map((step, index) => {
                  const currentIndex = ORDER_STEPS.findIndex(({ status }) => status === order.status);
                  const isComplete = currentIndex >= 0 && index < currentIndex;
                  const isCurrent = step.status === order.status;
                  return (
                    <li
                      key={step.status}
                      className={isCurrent ? 'is-current' : isComplete ? 'is-complete' : ''}
                      aria-current={isCurrent ? 'step' : undefined}
                    >
                      {step.label}
                    </li>
                  );
                })}
              </ol>
            )}
            <ul>
              {order.items.map((item) => (
                <li key={`${order._id}-${item.productId}`}>
                  {item.productName} × {item.quantity} — ${Number(item.lineTotal).toFixed(2)}
                </li>
              ))}
            </ul>
            <p><strong>Total: ${Number(order.totalAmount).toFixed(2)}</strong> · {order.paymentMethod}</p>
            <p>Pickup/delivery: {order.deliveryAddress}</p>
            {order.customerNote && <p>Note: {order.customerNote}</p>}
          </article>
        ))}
      </div>
    </main>
  );
};

export default CustomerOrdersPage;
