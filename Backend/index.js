require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { errorHandler } = require('./middlewares/errorHandler');

const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const supportRoutes = require('./routes/supportRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const customerRoutes = require('./routes/customerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});