import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import Components
import OrdersList from './components/Orders/OrdersList';
import ProductList from './components/Products/ProductList';
import NotificationsList from './components/Notifications/NotificationsList';
import SupplierDashboard from './components/Dashboard/SupplierDashboard';
import OrderDetails from './components/Orders/OrderDetails';  // Assuming you need this for detailed view
import ProductForm from './components/Products/ProductForm';  // Assuming you have a form for product creation/edit
import NotificationForm from './components/Notifications/NotificationForm';  // Assuming you have a form for creating notifications

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <h1>Supplier Dashboard</h1>
          <nav>
            <ul>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/notifications">Notifications</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            {/* Define Routes for different components */}
            <Route path="/" element={<SupplierDashboard />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} /> {/* Dynamic Route for Order Details */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/form" element={<ProductForm />} /> {/* Assuming there's a product form */}
            <Route path="/notifications" element={<NotificationsList />} />
            <Route path="/notifications/form" element={<NotificationForm />} /> {/* Assuming there's a notification form */}
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
