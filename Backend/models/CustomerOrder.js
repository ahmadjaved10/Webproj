const mongoose = require('mongoose');

const customerOrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', index: true },
    supplierName: { type: String, trim: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
        lineTotal: { type: Number, required: true, min: 0 },
    }],
    deliveryAddress: { type: String, required: true, trim: true },
    customerNote: { type: String, trim: true, maxlength: 500 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ['Placed', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
        default: 'Placed',
        index: true,
    },
    stockDeducted: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['Pay on pickup'], default: 'Pay on pickup' },
}, { timestamps: true });

module.exports = mongoose.model('CustomerOrder', customerOrderSchema);
