import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const PromotionList = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await API.get('/promotions');
                setPromotions(response.data);
            } catch (error) {
                console.error('Error fetching promotions:', error);
                setError('Failed to load promotions.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchPromotions();
    }, []);

    const deletePromotion = async (id) => {
        try {
            await API.delete(`/promotions/${id}`);
            setPromotions(promotions.filter((promotion) => promotion._id !== id));
        } catch (error) {
            console.error('Error deleting promotion:', error);
            setError('Failed to delete the promotion. Please try again.');
        }
    };

    if (loading) return <div>Loading promotions...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Promotions List</h2>
            <Link to="/promotions/form" className="btn btn-primary mb-3">Create New Promotion</Link>
            {promotions.length === 0 ? (
                <p>No promotions found.</p>
            ) : (
                <ul className="list-group">
                    {promotions.map((promotion) => (
                        <li key={promotion._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{promotion.title}</strong> - Discount: {promotion.discountPercentage}% - Status: {promotion.status}
                            </div>
                            <div>
                                {/* Link to edit form with promotion ID */}
                                <Link to={`/promotions/form?edit=${promotion._id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                                <button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => deletePromotion(promotion._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PromotionList;