import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { readCart, removeCartItem, updateCartQuantity } from './cartStorage';
import '../styles/components/customer.css';

const CustomerCartPage = () => {
  const [cart, setCart] = useState(readCart);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await API.get('/products/public');
        setProducts(response.data);
      } catch (requestError) {
        console.error('Could not load cart products', requestError);
        setError(requestError.response?.data?.message || 'Unable to refresh your cart prices.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const productsById = useMemo(
    () => new Map(products.map((product) => [product._id, product])),
    [products]
  );
  const total = cart.reduce((sum, item) => {
    const product = productsById.get(item.productId);
    return sum + (Number(product?.effectivePrice ?? product?.price) || 0) * item.quantity;
  }, 0);
  const hasUnavailableItem = cart.some((item) => !productsById.has(item.productId));

  const changeQuantity = (productId, quantity) => setCart(updateCartQuantity(productId, quantity));
  const removeItem = (productId) => setCart(removeCartItem(productId));

  return (
    <main className="customer-page customer-cart-page">
      <div className="customer-page-heading">
        <div>
          <p className="customer-eyebrow">Your selections</p>
          <h1>Your cart</h1>
        </div>
        <Link to="/shop" className="customer-button customer-button-secondary">Continue shopping</Link>
      </div>
      {error && <p className="customer-error" role="alert">{error}</p>}
      {isLoading ? <p>Refreshing prices...</p> : null}
      {!isLoading && cart.length === 0 && <p>Your cart is empty.</p>}
      <div className="customer-cart-items">
        {cart.map((item) => {
          const product = productsById.get(item.productId);
          return (
            <article className="customer-cart-row" key={item.productId}>
              <div>
                <h2>{product?.name || 'Unavailable product'}</h2>
                <p>{product ? `$${Number(product.effectivePrice ?? product.price).toFixed(2)} each` : 'This product is no longer available.'}</p>
              </div>
              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(event) => changeQuantity(item.productId, event.target.value)}
                />
              </label>
              <button type="button" className="customer-button customer-button-secondary" onClick={() => removeItem(item.productId)}>
                Remove
              </button>
            </article>
          );
        })}
      </div>
      {cart.length > 0 && (
        <section className="customer-cart-summary">
          <p>Estimated total <strong>${total.toFixed(2)}</strong></p>
          <p>Final prices and stock are verified when you place the order.</p>
          {hasUnavailableItem && <p className="customer-error">Remove unavailable items before checkout.</p>}
          <Link
            to="/customer/checkout"
            className={`customer-button${hasUnavailableItem || isLoading ? ' customer-button-disabled' : ''}`}
            aria-disabled={hasUnavailableItem || isLoading}
            onClick={(event) => {
              if (hasUnavailableItem || isLoading) event.preventDefault();
            }}
          >
            Checkout
          </Link>
        </section>
      )}
    </main>
  );
};

export default CustomerCartPage;
