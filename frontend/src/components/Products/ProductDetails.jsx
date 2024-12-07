import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';  // Use your centralized API service
import '../styles/components/product.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    images: [],
    category: '',
    status: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Detailed error:', err.response);
        setError(err.response?.data?.message || 'Error fetching product details. Please try again later.');
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(`/products/${id}`, product);
      setProduct(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err.response);
      setError('Error updating product');
    }
  };

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error}
          <button 
            className="btn btn-secondary ms-2" 
            onClick={() => navigate('/products')}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="img-fluid rounded mb-4" 
            />
          ) : (
            <p>No image available</p>
          )}
        </div>
        <div className="col-md-6">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="form-group mb-3">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mb-3">
                <label>Stock</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button 
                type="button" 
                className="btn btn-secondary ms-2" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{product.name}</h2>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
              <p><strong>Status:</strong> {product.status}</p>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleString()}</p>
              <button
                className="btn btn-secondary mt-3"
                onClick={() => setIsEditing(true)}
              >
                Edit Product
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;