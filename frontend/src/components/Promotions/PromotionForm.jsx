import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/components/promotion.css';

const toDateTimeLocal = (value) => {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
};

const PromotionForm = () => {
    const [products, setProducts] = useState([]);
    const [promotionData, setPromotionData] = useState({
        title: '',
        discountPercentage: '',
        description: '',
        products: [],
        startDate: '',
        endDate: '',
        status: 'Active',
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
                    const promotionResponse = await API.get(`/promotions/${editMode}`);
                    const promotion = promotionResponse.data;
                    setPromotionData({
                        title: promotion.title || '',
                        discountPercentage: promotion.discountPercentage,
                        description: promotion.description || '',
                        products: (promotion.products || []).map((product) => (
                            String(product._id || product)
                        )),
                        startDate: toDateTimeLocal(promotion.startDate),
                        endDate: toDateTimeLocal(promotion.endDate),
                        status: promotion.status || 'Active',
                        _id: promotion._id,
                    });
                }
            } catch (error) {
                console.error('Error loading promotion form:', error);
                setErrorMessage(error.response?.data?.message || 'Failed to load promotion form.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFormData();
    }, [editMode]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPromotionData((currentData) => ({ ...currentData, [name]: value }));
    };

    const handleProductToggle = (productId) => {
        setPromotionData((currentData) => {
            const selected = currentData.products.includes(productId);
            return {
                ...currentData,
                products: selected
                    ? currentData.products.filter((id) => id !== productId)
                    : [...currentData.products, productId],
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        const payload = {
            ...promotionData,
            discountPercentage: Number(promotionData.discountPercentage),
            startDate: promotionData.startDate || null,
            endDate: promotionData.endDate || null,
        };

        try {
            if (promotionData._id) {
                await API.put(`/promotions/${promotionData._id}`, payload);
            } else {
                await API.post('/promotions', payload);
            }
            navigate('/promotions');
        } catch (error) {
            console.error('Error submitting promotion:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to save promotion.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="container mt-4">Loading promotion form...</div>;
    }

    return (
        <div className="container page-shell">
            <form onSubmit={handleSubmit} className="form-card form-card--wide">
                <h2>{promotionData._id ? 'Edit Promotion' : 'Create Promotion'}</h2>
                {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        className="form-control"
                        value={promotionData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="discountPercentage" className="form-label">Discount percentage</label>
                    <input
                        id="discountPercentage"
                        type="number"
                        name="discountPercentage"
                        className="form-control"
                        min="0.01"
                        max="100"
                        step="0.01"
                        value={promotionData.discountPercentage}
                        onChange={handleChange}
                        required
                    />
                </div>
                <fieldset className="mb-3">
                    <legend className="form-label">Products included</legend>
                    <p className="form-text">
                        The discount applies only during the promotion dates. Regular product prices are not changed.
                    </p>
                    {products.length === 0 ? (
                        <p className="form-text">Add a product before creating a promotion.</p>
                    ) : (
                        products.map((product) => (
                            <div className="form-check" key={product._id}>
                                <input
                                    id={`promotion-product-${product._id}`}
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={promotionData.products.includes(product._id)}
                                    onChange={() => handleProductToggle(product._id)}
                                />
                                <label className="form-check-label" htmlFor={`promotion-product-${product._id}`}>
                                    {product.name} — ${product.price}
                                </label>
                            </div>
                        ))
                    )}
                </fieldset>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        value={promotionData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="startDate" className="form-label">Starts (optional)</label>
                        <input
                            id="startDate"
                            type="datetime-local"
                            name="startDate"
                            className="form-control"
                            value={promotionData.startDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="endDate" className="form-label">Ends (optional)</label>
                        <input
                            id="endDate"
                            type="datetime-local"
                            name="endDate"
                            className="form-control"
                            value={promotionData.endDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                        id="status"
                        name="status"
                        className="form-select"
                        value={promotionData.status}
                        onChange={handleChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || products.length === 0 || promotionData.products.length === 0}
                >
                    {isSubmitting ? 'Saving...' : promotionData._id ? 'Update Promotion' : 'Create Promotion'}
                </button>
            </form>
        </div>
    );
};

export default PromotionForm;
