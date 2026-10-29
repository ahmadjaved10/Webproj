import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { clearCart, readCart } from './cartStorage';
import '../styles/components/customer.css';

const CustomerCheckoutPage = () => {
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [cart, setCart] = useState(readCart);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCheckout = async () => {
      try {
        const [profileResponse, productsResponse] = await Promise.all([
          API.get('/customers/me'),
          API.get('/products/public'),
        ]);
        setAddress(profileResponse.data.customer.address || '');
        setProducts(productsResponse.data);
      } catch (requestError) {
        console.error('Could not load checkout', requestError);
        setError(requestError.response?.data?.message || 'Unable to load checkout details.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCheckout();
  }, []);

  const productById = new Map(products.map((product) => [product._id, product]));
  const estimatedTotal = cart.reduce((total, item) => (
    total + (Number(productById.get(item.productId)?.effectivePrice) || 0) * item.quantity
  ), 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const { data } = await API.post('/customers/orders', {
        items: cart,
        deliveryAddress: address,
        customerNote: note,
      });
      clearCart();
      setCart([]);
      const orders = data.orders || (data.order ? [data.order] : []);
      navigate('/customer/orders', {
        replace: true,
        state: {
          createdOrderIds: orders.map((order) => order._id),
          createdOrders: orders.map((order) => ({
            id: order._id,
            supplierName: order.supplierName || 'Supplier',
          })),
          notificationWarning: data.notificationWarning,
        },
      });
    } catch (requestError) {
      console.error('Checkout failed', requestError);
      setError(requestError.response?.data?.message || 'Could not place your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <main className="customer-page"><p>Loading checkout...</p></main>;
  }

  if (cart.length === 0) {
    return <main className="customer-page"><h1>Your cart is empty</h1></main>;
  }

  return (
    <main className="customer-page customer-checkout-page">
      <p className="customer-eyebrow">No online payment</p>
      <h1>Checkout</h1>
      <p>Each supplier receives only the products in their part of your order. Orders from different suppliers are tracked separately; stock is deducted when each supplier accepts.</p>
      {error && <p className="customer-error" role="alert">{error}</p>}
      <form className="customer-form" onSubmit={handleSubmit}>
        <label htmlFor="deliveryAddress">Pickup or delivery address</label>
        <textarea
          id="deliveryAddress"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          required
          rows="3"
        />
        <label htmlFor="customerNote">Order note (optional)</label>
        <textarea
          id="customerNote"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength="500"
          rows="3"
        />
        <section className="customer-cart-summary">
          <h2>Order total: ${estimatedTotal.toFixed(2)}</h2>
          <p>Pay on pickup. Prices and stock are rechecked by the server.</p>
        </section>
        <button type="submit" className="customer-button" disabled={isSubmitting || !address.trim()}>
          {isSubmitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </main>
  );
};

export default CustomerCheckoutPage;
