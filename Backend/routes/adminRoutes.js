const express = require('express');
const adminController = require('../controllers/adminController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', adminController.login);
router.use(authMiddleware, requireRole('admin'));
router.get('/summary', adminController.getSummary);
router.get('/suppliers', adminController.getSuppliers);
router.get('/customers', adminController.getCustomers);
router.patch('/suppliers/:id/approval', adminController.updateSupplierApproval);
router.delete('/suppliers/:id', adminController.deleteSupplier);
router.delete('/customers/:id', adminController.deleteCustomer);
router.get('/orders', adminController.getOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);
router.get('/support-tickets', adminController.getSupportTickets);
router.patch('/support-tickets/:id/status', adminController.updateSupportTicketStatus);

module.exports = router;
