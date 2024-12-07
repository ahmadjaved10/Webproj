import React, { useState, useEffect } from 'react';
import API from '../services/api';  // Axios instance for backend requests
import { Link } from 'react-router-dom';  // Importing Link for navigation
import '../styles/components/product.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));  // Removing deleted product from state
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Product List</h2>
      <div className="mb-4">
        <Link to="/add-product" className="btn btn-success">Add New Product</Link>
      </div>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product._id}> {/* Use product._id here */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Price: ${product.price}</p>
                <p className="card-text">Stock: {product.stock}</p>
                <p className="card-text">Status: {product.status}</p>
                <Link to={`/products/${product._id}`} className="btn btn-primary">Edit</Link> {/* Include product._id here */}
                <button className="btn btn-danger ms-2" onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
