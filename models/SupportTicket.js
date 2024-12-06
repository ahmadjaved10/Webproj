const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
