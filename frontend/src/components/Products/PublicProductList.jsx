import React, { useEffect, useState } from 'react';
import API from '../services/api';
import '../styles/components/product.css';
import '../styles/components/public-offers.css';

const PublicProductList = () => {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products/public');
        setProducts(response.data);
      } catch (error) {
        console.error('Error loading public products:', error);
        setErrorMessage('Products are temporarily unavailable.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const activeOffers = products.filter((product) => Number(product.discountPercentage) > 0);

  return (
    <section className="container page-shell" aria-labelledby="public-products-title">
      <h2 id="public-products-title" className="text-center mb-4">Fresh products &amp; supplier offers</h2>
      {isLoading && <p className="text-center">Loading products...</p>}
      {errorMessage && <p className="alert alert-danger" role="alert">{errorMessage}</p>}
      {!isLoading && !errorMessage && products.length === 0 && (
        <p className="text-center">No products are available right now.</p>
      )}
      {!isLoading && !errorMessage && activeOffers.length > 0 && (
        <aside className="public-offers-banner" aria-label="Current supplier discounts">
          <div>
            <p className="public-offers-eyebrow">Limited-time supplier discounts</p>
            <h3>Live offers</h3>
          </div>
          <ul>
            {activeOffers.map((product) => (
              <li key={product._id}>
                <span>{product.name}</span>
                <strong>{product.discountPercentage}% off</strong>
              </li>
            ))}
          </ul>
        </aside>
      )}
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product._id}>
            <article className="card h-100">
              <div className="card-body">
                <h3 className="h5 card-title">{product.name}</h3>
                {product.category && <p className="text-muted">{product.category}</p>}
                {product.description && <p className="card-text">{product.description}</p>}
                <p className="mb-1">
                  {product.discountPercentage > 0 ? (
                    <>
                      <del className="text-muted me-2">${product.basePrice.toFixed(2)}</del>
                      <strong className="text-success">${product.effectivePrice.toFixed(2)}</strong>
                      <span className="badge bg-success ms-2">Supplier offer · {product.discountPercentage}% off</span>
                    </>
                  ) : (
                    <strong>${product.effectivePrice.toFixed(2)}</strong>
                  )}
                </p>
                <p className="mb-0">In stock: {product.stock}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PublicProductList;
