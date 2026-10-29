const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const CustomerOrder = require('../models/CustomerOrder');
const Notification = require('../models/Notification');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const {
    getPromotionPricing,
    loadPromotionsForProducts,
} = require('../utils/promotionPricing');

const createRequestError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

const createToken = (customer) => jwt.sign(
    { id: customer._id, role: 'customer' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;
        if (typeof name !== 'string' || !name.trim() ||
            typeof email !== 'string' ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
            typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({
                message: 'Enter your name, a valid email, and a password of at least 8 characters.',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (await Customer.exists({ email: normalizedEmail })) {
            return res.status(409).json({ message: 'An account already exists for this email.' });
        }

        const customer = await Customer.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            phone,
            address,
        });

        res.status(201).json({
            token: createToken(customer),
            role: 'customer',
            customer: { id: customer._id, name: customer.name, email: customer.email },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'An account already exists for this email.' });
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const password = req.body.password;
        if (!email || typeof password !== 'string') {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const customer = await Customer.findOne({ email }).select('+password');
        if (!customer || !(await customer.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        res.json({
            token: createToken(customer),
            role: 'customer',
            customer: { id: customer._id, name: customer.name, email: customer.email },
        });
    } catch (error) {
        next(error);
    }
};

exports.getProfile = (req, res) => {
    res.json({
        customer: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            address: req.user.address,
        },
    });
};

exports.createOrder = async (req, res, next) => {
    try {
        if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty.' });
        }

        const deliveryAddress = typeof req.body.deliveryAddress === 'string'
            ? req.body.deliveryAddress.trim()
            : '';
        if (!deliveryAddress) {
            return res.status(400).json({ message: 'A pickup or delivery address is required.' });
        }

        const quantities = new Map();
        for (const item of req.body.items) {
            const productId = String(item.productId || '');
            const quantity = Number(item.quantity);
            if (!mongoose.Types.ObjectId.isValid(productId) ||
                !Number.isInteger(quantity) ||
                quantity < 1) {
                return res.status(400).json({
                    message: 'Each cart item must have a valid product and a positive whole-number quantity.',
                });
            }
            quantities.set(productId, (quantities.get(productId) || 0) + quantity);
        }

        const productIds = [...quantities.keys()];
        const approvedSupplierIds = await Supplier.find({
            $or: [
                { approvalStatus: 'Approved' },
                { approvalStatus: { $exists: false } },
            ],
        }).distinct('_id');
        const products = await Product.find({
            _id: { $in: productIds },
            supplierId: { $in: approvedSupplierIds },
            status: 'Active',
            stock: { $gt: 0 },
        }).lean();
        if (products.length !== productIds.length) {
            return res.status(400).json({ message: 'One or more products are no longer available.' });
        }

        const productsById = new Map(products.map((product) => [String(product._id), product]));
        for (const [productId, quantity] of quantities) {
            if (productsById.get(productId).stock < quantity) {
                return res.status(400).json({
                    message: `${productsById.get(productId).name} does not have enough stock.`,
                });
            }
        }

        const promotions = await loadPromotionsForProducts(products.map((product) => product._id));
        const items = productIds.map((productId) => {
            const product = productsById.get(productId);
            const pricing = getPromotionPricing(product, promotions);
            const quantity = quantities.get(productId);
            const lineTotal = Number((pricing.effectivePrice * quantity).toFixed(2));
            return {
                productId: product._id,
                supplierId: product.supplierId,
                productName: product.name,
                quantity,
                unitPrice: pricing.effectivePrice,
                discountPercentage: pricing.discountPercentage,
                lineTotal,
            };
        });
        const supplierIds = [...new Set(items.map((item) => String(item.supplierId)))];
        const suppliers = await Supplier.find({ _id: { $in: supplierIds } })
            .select('name')
            .lean();
        const supplierNames = new Map(suppliers.map((supplier) => [String(supplier._id), supplier.name]));
        const itemsBySupplier = new Map();
        for (const item of items) {
            const supplierId = String(item.supplierId);
            if (!itemsBySupplier.has(supplierId)) itemsBySupplier.set(supplierId, []);
            itemsBySupplier.get(supplierId).push(item);
        }

        const orderDocuments = [...itemsBySupplier.entries()].map(([supplierId, supplierItems]) => ({
            customerId: req.user._id,
            supplierId,
            supplierName: supplierNames.get(supplierId) || 'Supplier',
            items: supplierItems,
            deliveryAddress,
            customerNote: typeof req.body.customerNote === 'string' ? req.body.customerNote.trim() : '',
            totalAmount: Number(supplierItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)),
        }));

        const orders = await CustomerOrder.insertMany(orderDocuments);
        let notificationWarning;
        try {
            await Notification.insertMany(orders.map((order) => ({
                supplierId: order.supplierId,
                type: 'Order Alert',
                message: `New customer order ${order._id} is waiting for your review.`,
            })));
        } catch (notificationError) {
            console.error('Customer order was created but supplier notifications could not be saved.', notificationError);
            notificationWarning = 'Your order was placed, but supplier alerts could not be created. Suppliers can still view it in their customer orders page.';
        }

        res.status(201).json({ orders, order: orders[0], notificationWarning });
    } catch (error) {
        next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await CustomerOrder.find({ customerId: req.user._id })
            .populate('supplierId', 'name')
            .populate('items.supplierId', 'name')
            .sort({ createdAt: -1 })
            .lean();
        res.json({
            orders: orders.map((order) => {
                const itemSuppliers = [...new Set(
                    (order.items || [])
                        .map((item) => item.supplierId?.name)
                        .filter(Boolean)
                )];
                return {
                    ...order,
                    supplierName: order.supplierName ||
                        order.supplierId?.name ||
                        itemSuppliers.join(', ') ||
                        'Supplier information unavailable',
                };
            }),
        });
    } catch (error) {
        next(error);
    }
};
