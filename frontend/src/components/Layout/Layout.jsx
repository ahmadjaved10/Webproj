// src/components/Layout/Layout.jsx
import React from 'react';
  // Import Headerimport Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer';  // Import Footer
import '../styles/layout.css';  // Add your layout-specific styles here

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children} {/* This will render the routes' components */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
