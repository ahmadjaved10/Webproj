const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const inventoryLogSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    changeType: { type: String, enum: ['Add', 'Remove', 'Restock'], required: true },
    changeQuantity: { type: Number, required: true },
    remainingStock: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
