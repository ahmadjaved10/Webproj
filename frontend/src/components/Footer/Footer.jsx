import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/footer.css';

const Footer = () => {
 return (
   <footer className="footer">
     <div className="footer-content">
       <div className="footer-section">
         <h3>About Us</h3>
         <p>We are a company dedicated to providing the freshest and most delicious food.</p>
       </div>
       <div className="footer-section">
         <h3>Quick Links</h3>
         <ul>
           <li><Link to="/menu">Menu</Link></li>
           <li><Link to="/orders">Orders</Link></li>
           <li><Link to="/products">Products</Link></li>
           <li><Link to="/notifications">Notifications</Link></li>
         </ul>
       </div>
       <div className="footer-section">
         <h3>Contact Us</h3>
         <p>Email: info@teatyandfreshfood.com</p>
         <p>Phone: 123-456-7890</p>
       </div>
     </div>
     <div className="footer-bottom">
       <p>&copy; 2023 Teaty & Fresh Food. All rights reserved.</p>
     </div>
   </footer>
 );
};

export default Footer;