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
  const [images, setImages] = useState([]);
  const [supplierId, setSupplierId] = useState(''); // New state for supplierId

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare product data with supplierId
    const newProduct = {
      name: productName,
      description,
      category,
      price,
      stock,
      status,
      images,
      supplierId,  // Include supplierId in the product object
    };

    try {
      const response = await API.post('/products', newProduct);
      console.log('Product added successfully:', response.data);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="shadow-sm p-4 bg-light rounded">
        <div className="mb-3">
          <label className="form-label">Product Name:</label>
          <input
            type="text"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Category:</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock:</label>
          <input
            type="number"
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
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

        {/* Add Supplier ID input */}
        <div className="mb-3">
          <label className="form-label">Supplier ID:</label>
          <input
            type="text"
            className="form-control"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)} // Handle supplier ID input
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
