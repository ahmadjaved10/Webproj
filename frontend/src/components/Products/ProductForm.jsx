import React, { useState } from 'react';
import API from '../services/api';
import '../styles/components/product.css';


const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('Active');
  const [createdProductId, setCreatedProductId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatedProductId('');
    setErrorMessage('');
    setIsSubmitting(true);

    const newProduct = {
      name: productName,
      description,
      category,
      price,
      stock,
      status,
    };

    try {
      const response = await API.post('/products', newProduct);
      setCreatedProductId(response.data._id);
      setProductName('');
      setDescription('');
      setCategory('');
      setPrice('');
      setStock('');
      setStatus('Active');
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        'Unable to add product. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page-shell">
      <h2 className="text-center mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="form-card form-card--wide">
        {createdProductId && (
          <div className="alert alert-success" role="status">
            Product added successfully. Product ID: <code>{createdProductId}</code>
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">{errorMessage}</div>
        )}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Product Name:</label>
            <input
              type="text"
              className="form-control"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Category:</label>
            <input
              type="text"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Price:</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Stock:</label>
            <input
              type="number"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Status:</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-5" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
