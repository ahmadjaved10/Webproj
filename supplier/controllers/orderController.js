const Order = require('../models/Order');

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ supplierId: req.user._id });
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};


exports.findOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('products.productId'); // Populate product details if needed
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { customerName, totalAmount, orderStatus, products } = req.body;

        // Validate order status if necessary
        if (!['Pending', 'Processing', 'Completed', 'Cancelled'].includes(orderStatus)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, {
            customerName,
            totalAmount,
            orderStatus,
            products
        }, { new: true });

        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.addOrder = async (req, res, next) => {
    try {
        const { products, totalAmount } = req.body;
        const newOrder = new Order({
            supplierId: req.user._id,
            products,
            totalAmount,
            orderStatus: 'Pending',
        });
        
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        next(error);
    }
};