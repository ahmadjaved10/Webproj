const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String }],
    status: { type: String, enum: ['Active', 'Inactive', 'Out of Stock'], default: 'Active' },
    availability: {
        startDate: { type: Date },
        endDate: { type: Date },
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
