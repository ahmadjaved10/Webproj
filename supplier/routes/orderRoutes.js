const express = require('express');
const { getOrders, findOrderById, updateOrder, addOrder, deleteOrder } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getOrders);
router.get('/:id', findOrderById); // New route for finding an order by ID
router.put('/:id', updateOrder); // Updated route for updating an order
router.post('/', addOrder); 
router.delete('/:id', deleteOrder);

module.exports = router;