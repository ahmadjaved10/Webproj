const express = require('express');
const { createSupportTicket, getSupportTickets } = require('../controllers/supportController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', createSupportTicket);
router.get('/', getSupportTickets);

module.exports = router;
