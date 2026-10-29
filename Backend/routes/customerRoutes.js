const express = require('express');
const customerController = require('../controllers/customerController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', customerController.register);
router.post('/login', customerController.login);
router.use(authMiddleware, requireRole('customer'));
router.get('/me', customerController.getProfile);
router.get('/orders', customerController.getOrders);
router.post('/orders', customerController.createOrder);

module.exports = router;
