import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/header.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    return (
        <header className="header bg-light sticky-top shadow-sm">
            <div className="container d-flex justify-content-between align-items-center py-3">
                <Link to="/" className="logo h1 text-dark fw-bold">TASTY & Fresh Food</Link>
                <nav>
                    <ul className="nav">
                        <li className="nav-item">
                            <Link to="/home" className="nav-link text-dark px-3 py-2 rounded hover-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/orders" className="nav-link text-dark px-3 py-2 rounded hover-link">Orders</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/products" className="nav-link text-dark px-3 py-2 rounded hover-link">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/notifications" className="nav-link text-dark px-3 py-2 rounded hover-link">Notifications</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/promotions" className="nav-link text-dark px-3 py-2 rounded hover-link">Promotions</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/inventory" className="nav-link text-dark px-3 py-2 rounded hover-link">Inventory</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/support" className="nav-link text-dark px-3 py-2 rounded hover-link">Support Tickets</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
