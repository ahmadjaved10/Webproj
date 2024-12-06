const express = require('express');
const {
    getNotifications,
    markAsRead,
    createNotification,
} = require('../controllers/notificationController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.post('/', createNotification); // New route to create a notification

module.exports = router;
