import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-panel">
      <div className="footer-grid">
        <div className="footer-about">
          <Link to="/" className="footer-logo">🥗 Tasty<span>&amp;</span>Fresh</Link>
          <p>We are dedicated to serving the freshest, most delicious food, made with care and delivered with a smile.</p>
        </div>

        <div className="footer-col">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/about">About us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Manage</h3>
          <ul>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <ul>
            <li><a href="mailto:info@tastyandfreshfood.com">info@tastyandfreshfood.com</a></li>
            <li><a href="tel:1234567890">123-456-7890</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Tasty &amp; Fresh Food. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;