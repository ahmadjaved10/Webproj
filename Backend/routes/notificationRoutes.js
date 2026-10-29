const express = require('express');
const {
    getNotifications,
    markAsRead,
    createNotification,
} = require('../controllers/notificationController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware, requireRole('supplier'));

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.post('/', createNotification); // New route to create a notification

module.exports = router;
