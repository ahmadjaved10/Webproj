const Order = require('../models/Order');

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ supplierId: req.user._id });
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        if (!['Pending', 'Processing', 'Completed', 'Cancelled'].includes(orderStatus)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};



exports.addOrder = async (req, res, next) => {
    try {
        const { products, totalAmount } = req.body;

        // Create a new order linked to the authenticated supplier
        const newOrder = new Order({
            supplierId: req.user._id,
            products,
            totalAmount,
            orderStatus: 'Pending', // Default status
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        next(error);
    }
};
