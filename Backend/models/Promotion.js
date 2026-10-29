const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    title: { type: String, required: true },
    description: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    discountPercentage: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);
