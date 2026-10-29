const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const {
    getPromotionPricing,
    loadPromotionsForProducts,
} = require('../utils/promotionPricing');

const createBadRequest = (message) => Object.assign(new Error(message), { statusCode: 400 });

const buildOrderProducts = async (items, supplierId) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw createBadRequest('Add at least one product to the order.');
    }

    const quantities = new Map();
    for (const item of items) {
        const productId = String(item.productId || '');
        const quantity = Number(item.quantity);
        if (!mongoose.Types.ObjectId.isValid(productId) ||
            !Number.isInteger(quantity) ||
            quantity <= 0) {
            throw createBadRequest('Each order item needs a valid product and a positive whole-number quantity.');
        }
        quantities.set(productId, (quantities.get(productId) || 0) + quantity);
    }

    const productIds = [...quantities.keys()];
    const products = await Product.find({
        _id: { $in: productIds },
        supplierId,
        status: 'Active',
    }).lean();
    if (products.length !== productIds.length) {
        throw createBadRequest('One or more selected products are unavailable or do not belong to this supplier.');
    }

    const promotions = await loadPromotionsForProducts(
        products.map((product) => product._id),
        supplierId
    );
    const productsById = new Map(products.map((product) => [String(product._id), product]));
    const orderProducts = productIds.map((productId) => {
        const product = productsById.get(productId);
        const pricing = getPromotionPricing(product, promotions);
        return {
            productId: product._id,
            quantity: quantities.get(productId),
            price: pricing.effectivePrice,
        };
    });

    const totalAmount = Number(orderProducts
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2));

    return { products: orderProducts, totalAmount };
};

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
        const order = await Order.findOne({
            _id: req.params.id,
            supplierId: req.user._id,
        }).populate('products.productId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(200).json(order);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid order ID.' });
        }
        next(error);
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            supplierId: req.user._id,
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const orderStatus = req.body.orderStatus || order.orderStatus;
        if (!['Pending', 'Processing', 'Completed', 'Cancelled'].includes(orderStatus)) {
            return res.status(400).json({ message: 'Invalid order status.' });
        }

        if (req.body.products !== undefined) {
            const pricing = await buildOrderProducts(req.body.products, req.user._id);
            order.products = pricing.products;
            order.totalAmount = pricing.totalAmount;
        }

        if (req.body.customerName !== undefined) {
            order.customerName = req.body.customerName;
        }
        order.orderStatus = orderStatus;

        await order.save();
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const deletedOrder = await Order.findOneAndDelete({
            _id: req.params.id,
            supplierId: req.user._id,
        });
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(200).json({ message: 'Order deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

exports.addOrder = async (req, res, next) => {
    try {
        const pricing = await buildOrderProducts(req.body.products, req.user._id);
        const order = new Order({
            supplierId: req.user._id,
            customerName: req.body.customerName,
            ...pricing,
            orderStatus: 'Pending',
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};
