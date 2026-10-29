import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const InventoryForm = () => {
    const [products, setProducts] = useState([]);
    const [inventoryData, setInventoryData] = useState({
        productId: '',
        changeQuantity: '',
        changeType: 'Add',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const editMode = new URLSearchParams(location.search).get('edit');

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const productsResponse = await API.get('/products');
                setProducts(productsResponse.data);

                if (editMode) {
                    const inventoryResponse = await API.get(`/inventory/${editMode}`);
                    setInventoryData({
                        productId: inventoryResponse.data.productId,
                        changeQuantity: inventoryResponse.data.changeQuantity,
                        changeType: inventoryResponse.data.changeType,
                    });
                }
            } catch (error) {
                console.error('Error loading inventory form:', error);
                setErrorMessage(error.response?.data?.message || 'Failed to load inventory form.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFormData();
    }, [editMode]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInventoryData((currentData) => ({ ...currentData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            if (editMode) {
                await API.put(`/inventory/${editMode}`, inventoryData);
            } else {
                await API.post('/inventory', inventoryData);
            }
            navigate('/inventory');
        } catch (error) {
            console.error('Error submitting inventory:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to submit inventory.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="container mt-4">Loading inventory form...</div>;
    }

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit} className="form-card">
                <h2>{editMode ? 'Edit Inventory Movement' : 'Record Inventory Movement'}</h2>
                {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                <div className="mb-3">
                    <label htmlFor="productId" className="form-label">Product</label>
                    <select
                        id="productId"
                        name="productId"
                        className="form-select"
                        value={inventoryData.productId || ''}
                        onChange={handleChange}
                        required
                        disabled={Boolean(editMode)}
                    >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                            <option key={product._id} value={product._id}>
                                {product.name} (current stock: {product.stock})
                            </option>
                        ))}
                    </select>
                    {products.length === 0 && (
                        <p className="form-text">Add a product before recording inventory.</p>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="changeQuantity" className="form-label">Quantity</label>
                    <input
                        id="changeQuantity"
                        type="number"
                        name="changeQuantity"
                        className="form-control"
                        min="1"
                        step="1"
                        value={inventoryData.changeQuantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="changeType" className="form-label">Movement</label>
                    <select
                        id="changeType"
                        name="changeType"
                        className="form-select"
                        value={inventoryData.changeType}
                        onChange={handleChange}
                        required
                    >
                        <option value="Add">Add stock</option>
                        <option value="Remove">Remove stock</option>
                        <option value="Restock">Restock</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || products.length === 0}
                >
                    {isSubmitting ? 'Saving...' : editMode ? 'Update Movement' : 'Record Movement'}
                </button>
            </form>
        </div>
    );
};

export default InventoryForm;
