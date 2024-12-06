const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const orderSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, enum: ['Pending', 'Processing', 'Completed', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
