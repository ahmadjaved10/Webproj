const SupportTicket = require('../models/SupportTicket');

// Create a new support ticket
exports.createSupportTicket = async (req, res, next) => {
    try {
        const ticket = new SupportTicket({ ...req.body, supplierId: req.user._id });
        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        next(error);
    }
};

// Get all support tickets for a supplier
exports.getSupportTickets = async (req, res, next) => {
    try {
        const tickets = await SupportTicket.find({ supplierId: req.user._id });
        res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
};

// Get a specific support ticket by ID
exports.getSupportTicketById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await SupportTicket.findById(id);
        if (!ticket) return res.status(404).json({ message: 'Support ticket not found' });
        res.status(200).json(ticket);
    } catch (error) {
        next(error);
    }
};

// Update a support ticket
exports.updateSupportTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedTicket = await SupportTicket.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTicket) return res.status(404).json({ message: 'Support ticket not found' });
        res.status(200).json(updatedTicket);
    } catch (error) {
        next(error);
    }
};

// Delete a support ticket
exports.deleteSupportTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedTicket = await SupportTicket.findByIdAndDelete(id);
        if (!deletedTicket) return res.status(404).json({ message: 'Support ticket not found' });
        res.status(200).json({ message: 'Support ticket deleted successfully' });
    } catch (error) {
        next(error);
    }
};