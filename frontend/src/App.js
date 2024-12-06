import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import MenuList from './components/Menu/MenuList';

import GalleryList from './components/Gallery/GalleryList';

import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';


import OrdersList from './components/Orders/OrdersList';
import OrderDetails from './components/Orders/OrderDetails';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import NotificationsList from './components/Notifications/NotificationsList';
import NotificationForm from './components/Notifications/NotificationForm';

function App() {
 return (
   <Router>
     <Header />
     <Hero />
     <MenuList />
     <GalleryList />
     <CTA />
     <Footer />

     <Routes>
       <Route path="/orders" element={<OrdersList />} />
       <Route path="/orders/:orderId" element={<OrderDetails />} />
       <Route path="/products" element={<ProductList />} />
       <Route path="/products/form" element={<ProductForm />} />
       <Route path="/notifications" element={<NotificationsList />} />
       <Route path="/notifications/form" element={<NotificationForm />} />
     </Routes>
   </Router>
 );
}

export default App;