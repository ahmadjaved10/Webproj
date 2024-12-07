import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

// Import Components

import Hero from './components/Hero/Hero';
import MenuList from './components/Menu/MenuList';
import GalleryList from './components/Gallery/GalleryList';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';

import OrdersList from './components/Orders/OrdersList';
import OrderDetails from './components/Orders/OrderDetails';
import OrderForm from './components/Orders/OrderForm';

import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import ProductDetails from './components/Products/ProductDetails';
// Import EditProduct component

import NotificationsList from './components/Notifications/NotificationsList';
import NotificationForm from './components/Notifications/NotificationForm';

import PromotionList from './components/Promotions/PromotionList';
import PromotionForm from './components/Promotions/PromotionForm';

import InventoryList from './components/Inventory/InventoryList';
import InventoryForm from './components/Inventory/InventoryForm';

import SupportTicketList from './components/Support/SupportTicketList';
import SupportTicketForm from './components/Support/SupportTicketForm';

import PrivateRoute from './components/Shared/PrivateRoute';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout'; // Layout component for common structure
import ErrorBoundary from './components/Shared/ErrorBoundary'; // Error handling component


function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Home Route with Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <ErrorBoundary>
                <Routes>
                  <Route path="home" element={
                    <>
                      <Hero />
                      <MenuList />
                      <GalleryList />
                      <CTA />
                      <Footer />
                    </>
                  } />

                  {/* Orders Routes */}
                  <Route path="/orders" element={<OrdersList />} />
                  <Route path="/orders/:orderId" element={<OrderDetails />} />
                  <Route path="/orders/form" element={<PrivateRoute element={<OrderForm />} />} />

                  {/* Products Routes */}
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/add-product" element={<PrivateRoute element={<ProductForm />} />} />
                  <Route path="/products/:id" element={<ProductDetails />} />

                   {/* New Route for Editing Product */}

                  {/* Notifications Routes */}
                  <Route path="notifications" element={<NotificationsList />} />
                  <Route path="notifications/form" element={<PrivateRoute element={<NotificationForm />} />} />

                  {/* Promotions Routes */}
                  <Route path="promotions" element={<PromotionList />} />
                  <Route path="promotions/form" element={<PrivateRoute element={<PromotionForm />} />} />

                  {/* Inventory Routes */}
                  <Route path="inventory" element={<InventoryList />} />
                  <Route path="inventory/form" element={<PrivateRoute element={<InventoryForm />} />} />

                  {/* Support Tickets Routes */}
                  <Route path="support" element={<SupportTicketList />} />
                  <Route path="support-tickets/form" element={<PrivateRoute element={<SupportTicketForm />} />} />
                </Routes>
              </ErrorBoundary>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
