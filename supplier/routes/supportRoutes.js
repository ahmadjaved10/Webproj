const express = require('express');
const { 
    createSupportTicket,
    getSupportTickets,
    getSupportTicketById,
    updateSupportTicket,
    deleteSupportTicket 
} = require('../controllers/supportController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

// Add a new support ticket
router.post('/', createSupportTicket);

// Get all support tickets
router.get('/', getSupportTickets);

// Get a specific support ticket by ID
router.get('/:id', getSupportTicketById);

// Update a support ticket
router.put('/:id', updateSupportTicket);

// Delete a support ticket
router.delete('/:id', deleteSupportTicket);

module.exports = router;