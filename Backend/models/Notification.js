const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const notificationSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    type: { type: String, enum: ['Order Alert', 'Low Stock Alert', 'Promotional Reminder'], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
