import React, { useEffect, useMemo, useState } from 'react';
import API from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderForm = () => {
    const [availableProducts, setAvailableProducts] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [orderStatus, setOrderStatus] = useState('Pending');
    const [items, setItems] = useState([{ productId: '', quantity: '1' }]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const editMode = new URLSearchParams(location.search).get('edit');
    const productsById = useMemo(
        () => new Map(availableProducts.map((product) => [product._id, product])),
        [availableProducts]
    );

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const productsResponse = await API.get('/products');
                setAvailableProducts(productsResponse.data.filter((product) => product.status === 'Active'));

                if (editMode) {
                    const orderResponse = await API.get(`/orders/${editMode}`);
                    const order = orderResponse.data;
                    setCustomerName(order.customerName || '');
                    setOrderStatus(order.orderStatus);
                    setItems(order.products.map((item) => ({
                        productId: String(item.productId._id || item.productId),
                        quantity: String(item.quantity),
                    })));
                }
            } catch (error) {
                console.error('Error loading order form:', error);
                setErrorMessage(error.response?.data?.message || 'Failed to load order form.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFormData();
    }, [editMode]);

    const updateItem = (index, field, value) => {
        setItems((currentItems) => currentItems.map((item, itemIndex) => (
            itemIndex === index ? { ...item, [field]: value } : item
        )));
    };

    const estimatedTotal = items.reduce((total, item) => {
        const product = productsById.get(item.productId);
        const price = Number(product?.effectivePrice ?? product?.price ?? 0);
        const quantity = Number(item.quantity) || 0;
        return total + price * quantity;
    }, 0);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        const payload = {
            customerName,
            orderStatus,
            products: items.map(({ productId, quantity }) => ({
                productId,
                quantity: Number(quantity),
            })),
        };

        try {
            if (editMode) {
                await API.put(`/orders/${editMode}`, payload);
            } else {
                await API.post('/orders', payload);
            }
            navigate('/orders');
        } catch (error) {
            console.error('Error saving order:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to save order.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="container mt-4">Loading order form...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>{editMode ? 'Edit Order' : 'Create New Order'}</h2>
            <form onSubmit={handleSubmit} className="form-card">
                {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                <div className="mb-3">
                    <label htmlFor="customerName" className="form-label">Customer name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="customerName"
                        value={customerName}
                        onChange={(event) => setCustomerName(event.target.value)}
                    />
                </div>
                <fieldset className="mb-3">
                    <legend className="form-label">Products</legend>
                    {items.map((item, index) => (
                        <div className="row align-items-end mb-2" key={`order-item-${index}`}>
                            <div className="col-md-7">
                                <label htmlFor={`order-product-${index}`} className="form-label">Product</label>
                                <select
                                    id={`order-product-${index}`}
                                    className="form-select"
                                    value={item.productId}
                                    onChange={(event) => updateItem(index, 'productId', event.target.value)}
                                    required
                                >
                                    <option value="">Select a product</option>
                                    {availableProducts.map((product) => (
                                        <option key={product._id} value={product._id}>
                                            {product.name} — ${Number(product.effectivePrice ?? product.price).toFixed(2)}
                                            {product.discountPercentage > 0 ? ` (${product.discountPercentage}% off)` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor={`order-quantity-${index}`} className="form-label">Quantity</label>
                                <input
                                    id={`order-quantity-${index}`}
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    step="1"
                                    value={item.quantity}
                                    onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger mb-1"
                                    onClick={() => setItems((currentItems) => currentItems.filter((_, itemIndex) => itemIndex !== index))}
                                    disabled={items.length === 1}
                                    aria-label={`Remove product ${index + 1}`}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-outline-success mt-2"
                        onClick={() => setItems((currentItems) => [...currentItems, { productId: '', quantity: '1' }])}
                        disabled={availableProducts.length === 0}
                    >
                        Add another product
                    </button>
                    {availableProducts.length === 0 && (
                        <p className="form-text">Add an active product before creating an order.</p>
                    )}
                </fieldset>
                <p className="fw-bold">Estimated total: ${estimatedTotal.toFixed(2)}</p>
                {editMode && (
                    <div className="mb-3">
                        <label htmlFor="orderStatus" className="form-label">Order status</label>
                        <select
                            className="form-select"
                            id="orderStatus"
                            value={orderStatus}
                            onChange={(event) => setOrderStatus(event.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                )}
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || availableProducts.length === 0}>
                    {isSubmitting ? 'Saving...' : editMode ? 'Update Order' : 'Create Order'}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;
