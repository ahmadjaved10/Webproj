import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/header.css';

const Header = () => {
 return (
   <header className="header">
     <div className="header-content">
       <Link to="/" className="logo">Teaty & Fresh Food</Link>
       <nav>
         <ul>
           <li><Link to="/menu">Menu</Link></li>
           <li><Link to="/orders">Orders</Link></li>
           <li><Link to="/products">Products</Link></li>
           <li><Link to="/notifications">Notifications</Link></li>
         </ul>
       </nav>
     </div>
   </header>
 );
};

export default Header;