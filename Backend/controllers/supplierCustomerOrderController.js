const mongoose = require('mongoose');
const CustomerOrder = require('../models/CustomerOrder');
const { updateCustomerOrderStatus } = require('../utils/customerOrderStatus');

exports.getCustomerOrders = async (req, res, next) => {
    try {
        const orders = await CustomerOrder.find({ supplierId: req.user._id })
            .populate('customerId', 'name email phone')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ orders });
    } catch (error) {
        next(error);
    }
};

exports.updateCustomerOrderStatus = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID.' });
        }

        const order = await CustomerOrder.findOne({
            _id: req.params.id,
            supplierId: req.user._id,
        });
        if (!order) {
            return res.status(404).json({ message: 'Customer order not found for this supplier.' });
        }

        await updateCustomerOrderStatus(order, req.body.status);
        res.json({ order });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        next(error);
    }
};
