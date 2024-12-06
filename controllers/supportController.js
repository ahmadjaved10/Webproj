const SupportTicket = require('../models/SupportTicket');

exports.createSupportTicket = async (req, res, next) => {
    try {
        const ticket = new SupportTicket({ ...req.body, supplierId: req.user._id });
        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        next(error);
    }
};

exports.getSupportTickets = async (req, res, next) => {
    try {
        const tickets = await SupportTicket.find({ supplierId: req.user._id });
        res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
};
