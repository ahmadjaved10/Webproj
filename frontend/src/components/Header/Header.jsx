import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/header.css';

const Header = () => {
    return (
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">TASTY & Fresh Food</Link>
          <nav>
            <ul>
            <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/notifications">Notifications</Link>
              </li>
              <li>
                <Link to="/promotions">Promotions</Link>
              </li>
              <li>
                <Link to="/inventory">Inventory</Link>
              </li>
              <li>
                <Link to="/support">Support Tickets</Link>
              </li>
              
            </ul>
          </nav>
        </div>
      </header>
    );
  };

export default Header;
