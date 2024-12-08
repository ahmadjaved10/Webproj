import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/footer.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-5">
      <div className="container footer-content">
        <div className="row">
          <div className="col-md-4 footer-section">
            <h3>About Us</h3>
            <p>We are a company dedicated to providing the freshest and most delicious food.</p>
          </div>
          <div className="col-md-4 footer-section">
            <h3>Quick Links</h3>
            <ul className="list-unstyled">
              <li><Link to="/menu" className="text-white hover-link">Menu</Link></li>
              <li><Link to="/orders" className="text-white hover-link">Orders</Link></li>
              <li><Link to="/products" className="text-white hover-link">Products</Link></li>
              <li><Link to="/notifications" className="text-white hover-link">Notifications</Link></li>
            </ul>
          </div>
          <div className="col-md-4 footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@tastyandfreshfood.com</p>
            <p>Phone: 123-456-7890</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center py-3">
        <p>&copy; 2023 Tasty & Fresh Food. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
