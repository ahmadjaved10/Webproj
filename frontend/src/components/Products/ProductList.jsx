

import React, { useState, useEffect } from 'react';
import API from '../services/api';  // Axios instance for backend requests

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');  // Assuming /products endpoint
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.price} - Stock: {product.stock}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
