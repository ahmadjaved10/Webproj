// ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const ProductDetails = () => {
  const { productId } = useParams(); // Extract productId from the URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError('Error fetching product details. Please try again later.');
        console.error(err);
      }
    };
    fetchProduct();
  }, [productId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div>
      <h2>{product.name}</h2>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleString()}</p>
    </div>
  );
};

export default ProductDetails;
