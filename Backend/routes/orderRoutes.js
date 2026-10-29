const express = require('express');
const { getOrders, findOrderById, updateOrder, addOrder, deleteOrder } = require('../controllers/orderController');
const supplierCustomerOrderController = require('../controllers/supplierCustomerOrderController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware, requireRole('supplier'));

router.get('/customer-orders', supplierCustomerOrderController.getCustomerOrders);
router.patch('/customer-orders/:id/status', supplierCustomerOrderController.updateCustomerOrderStatus);
router.get('/', getOrders);
router.get('/:id', findOrderById); // New route for finding an order by ID
router.put('/:id', updateOrder); // Updated route for updating an order
router.post('/', addOrder); 
router.delete('/:id', deleteOrder);

module.exports = router;