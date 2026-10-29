import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

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
import PublicProductList from './components/Products/PublicProductList';

import NotificationsList from './components/Notifications/NotificationsList';
import NotificationForm from './components/Notifications/NotificationForm';

import PromotionList from './components/Promotions/PromotionList';
import PromotionForm from './components/Promotions/PromotionForm';

import InventoryList from './components/Inventory/InventoryList';
import InventoryForm from './components/Inventory/InventoryForm';

import SupportTicketList from './components/Support/SupportTicketList';
import SupportTicketForm from './components/Support/SupportTicketForm';
import SupportTicketDetail from './components/Support/SupportTicketDetail';

import PrivateRoute from './components/Shared/PrivateRoute';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/Shared/ErrorBoundary';
import MenuPage from './components/Home/MenuPage';
import GalleryPage from './components/Home/GalleryPage';
import AboutPage from './components/Home/AboutPage';
import CustomerShopPage from './components/Customer/CustomerShopPage';
import CustomerCartPage from './components/Customer/CustomerCartPage';
import CustomerCheckoutPage from './components/Customer/CustomerCheckoutPage';
import CustomerLogin from './components/Customer/CustomerLogin';
import CustomerRegister from './components/Customer/CustomerRegister';
import CustomerOrdersPage from './components/Customer/CustomerOrdersPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboardPage from './components/Admin/AdminDashboardPage';

const HomePage = () => (
  <>
    <Hero />
    <MenuList />
    <PublicProductList />
    <GalleryList />
    <CTA />
    <Footer />
  </>
);

const renderPage = (page) => (
  <Layout>
    <ErrorBoundary>{page}</ErrorBoundary>
  </Layout>
);

const renderProtectedPage = (page, role = 'supplier') => (
  <PrivateRoute element={renderPage(page)} role={role} />
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={renderPage(<HomePage />)} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/about" element={renderPage(<AboutPage />)} />
        <Route path="/menu" element={renderPage(<MenuPage />)} />
        <Route path="/gallery" element={renderPage(<GalleryPage />)} />
        <Route path="/shop" element={renderPage(<CustomerShopPage />)} />
        <Route path="/customer/cart" element={renderPage(<CustomerCartPage />)} />
        <Route path="/customer/checkout" element={renderProtectedPage(<CustomerCheckoutPage />, 'customer')} />
        <Route path="/customer/orders" element={renderProtectedPage(<CustomerOrdersPage />, 'customer')} />
        <Route path="/admin" element={renderProtectedPage(<AdminDashboardPage />, 'admin')} />

        <Route path="/orders" element={renderProtectedPage(<OrdersList />)} />
        <Route path="/orders/:orderId" element={renderProtectedPage(<OrderDetails />)} />
        <Route path="/orders/form" element={renderProtectedPage(<OrderForm />)} />

        <Route path="/products" element={renderProtectedPage(<ProductList />)} />
        <Route path="/add-product" element={renderProtectedPage(<ProductForm />)} />
        <Route path="/products/:id" element={renderProtectedPage(<ProductDetails />)} />

        <Route path="/notifications" element={renderProtectedPage(<NotificationsList />)} />
        <Route path="/notifications/form" element={renderProtectedPage(<NotificationForm />)} />

        <Route path="/promotions" element={renderProtectedPage(<PromotionList />)} />
        <Route path="/promotions/form" element={renderProtectedPage(<PromotionForm />)} />

        <Route path="/inventory" element={renderProtectedPage(<InventoryList />)} />
        <Route path="/inventory/form" element={renderProtectedPage(<InventoryForm />)} />

        <Route path="/support" element={renderProtectedPage(<SupportTicketList />)} />
        <Route path="/support/form" element={renderProtectedPage(<SupportTicketForm />)} />
        <Route path="/support/:id" element={renderProtectedPage(<SupportTicketDetail />)} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
