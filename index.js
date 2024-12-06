require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errorHandler } = require('./supplier/middlewares/errorHandler');  // Check if this exists
const supplierRoutes = require('./supplier/routes/supplierRoutes');
const productRoutes = require('./supplier/routes/productRoutes');
const orderRoutes=require('./supplier/routes/orderRoutes');
const promotionRoutes=require('./supplier/routes/promotionRoutes');
const supportRoutes=require('./supplier/routes/supportRoutes');
const inventoryRoutes=require('./supplier/routes/inventoryRoutes');
const notificationRoutes=require('./supplier/routes/notificationRoutes');

const connectDB = require('./supplier/config/db');  // Import your database connection function

// Load environment variables
const PORT = process.env.PORT || 5000;  // Define PORT before server starts
const MONGO_URI = process.env.MONGO_URI;  // Define MONGO_URI

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promotions',promotionRoutes);
app.use('/api/support',supportRoutes);
app.use('/api/inventory',inventoryRoutes);
app.use('/api/notifications',notificationRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection
connectDB();

// Start the server after successful DB connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
