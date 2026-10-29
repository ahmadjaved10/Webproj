import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { addCartItem, readCart } from './cartStorage';
import '../styles/components/customer.css';

const CustomerShopPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(readCart);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await API.get('/products/public');
        setProducts(response.data);
      } catch (requestError) {
        console.error('Could not load products', requestError);
        setError(requestError.response?.data?.message || 'Products are unavailable right now.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAdd = (product) => {
    setCart(addCartItem(product._id));
    setMessage(`${product.name} added to your cart.`);
    setError('');
  };

  return (
    <main className="customer-page">
      <div className="customer-page-heading">
        <div>
          <p className="customer-eyebrow">Fresh food, easy ordering</p>
          <h1>Shop the menu</h1>
          <p>Choose your favorites. Pay on pickup; no online payment is collected.</p>
        </div>
        <Link className="customer-button customer-button-secondary" to="/customer/cart">
          Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
        </Link>
      </div>

      {message && <p className="customer-notice" role="status">{message}</p>}
      {error && <p className="customer-error" role="alert">{error}</p>}
      {isLoading && <p>Loading available products...</p>}
      {!isLoading && !error && products.length === 0 && <p>No products are currently available.</p>}

      <div className="customer-product-grid">
        {products.map((product) => (
          <article className="customer-product-card" key={product._id}>
            {product.images?.[0] && <img src={product.images[0]} alt="" />}
            <div className="customer-product-content">
              <p className="customer-eyebrow">{product.category || 'Freshly prepared'}</p>
              <h2>{product.name}</h2>
              {product.description && <p>{product.description}</p>}
              <p>Available: {product.stock}</p>
              <p className="customer-price">
                {product.discountPercentage > 0 && (
                  <del>${Number(product.basePrice).toFixed(2)}</del>
                )}
                <strong>${Number(product.effectivePrice ?? product.price).toFixed(2)}</strong>
                {product.discountPercentage > 0 && (
                  <span>{product.discountPercentage}% off</span>
                )}
              </p>
              <button
                type="button"
                className="customer-button"
                onClick={() => handleAdd(product)}
                disabled={product.stock < 1}
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default CustomerShopPage;
