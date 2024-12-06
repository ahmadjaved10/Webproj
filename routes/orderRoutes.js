const express = require('express');
const { getOrders, updateOrderStatus, addOrder } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);
router.post('/', addOrder); // New route to add an order

module.exports = router;
