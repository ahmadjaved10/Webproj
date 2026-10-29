const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const CustomerOrder = require('../models/CustomerOrder');
const {
    addPromotionPricing,
    getPromotionPricing,
    loadPromotionsForProducts,
} = require('../utils/promotionPricing');

exports.addProduct = async (req, res, next) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Log in as a supplier before adding products.' });
        }

        const product = new Product({
            ...req.body,
            supplierId: req.user._id,
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

exports.getPublicProducts = async (req, res, next) => {
    try {
        const approvedSupplierIds = await Supplier.find({
            $or: [
                { approvalStatus: 'Approved' },
                { approvalStatus: { $exists: false } },
            ],
        }).distinct('_id');
        const products = await Product.find({
            supplierId: { $in: approvedSupplierIds },
            status: 'Active',
            stock: { $gt: 0 },
        }).lean();
        const promotions = await loadPromotionsForProducts(products.map((product) => product._id));
        res.status(200).json(addPromotionPricing(products, promotions));
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            supplierId: req.user._id
        }).lean();

        if (!product) {
            return res.status(404).json({ message: 'Product not found or you are not authorized to access it.' });
        }

        const promotions = await loadPromotionsForProducts([product._id], req.user._id);
        res.status(200).json({
            ...product,
            ...getPromotionPricing(product, promotions),
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format.' });
        }
        next(error);
    }
};





exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ supplierId: req.user._id }).lean();
        const promotions = await loadPromotionsForProducts(
            products.map((product) => product._id),
            req.user._id
        );
        res.status(200).json(addPromotionPricing(products, promotions));
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const fields = ['name', 'description', 'category', 'price', 'stock', 'images', 'status', 'availability'];
        const updates = Object.fromEntries(
            fields
                .filter((field) => req.body[field] !== undefined)
                .map((field) => [field, req.body[field]])
        );
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, supplierId: req.user._id },
            updates,
            { new: true, runValidators: true }
        ).lean();
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const promotions = await loadPromotionsForProducts([product._id], req.user._id);
        res.status(200).json({
            ...product,
            ...getPromotionPricing(product, promotions),
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format.' });
        }
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const activeOrder = await CustomerOrder.exists({
            supplierId: req.user._id,
            'items.productId': req.params.id,
            status: { $nin: ['Completed', 'Cancelled'] },
        });
        if (activeOrder) {
            return res.status(409).json({
                message: 'This product is part of an active customer order and cannot be deleted yet.',
            });
        }
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            supplierId: req.user._id,
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(204).end();
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format.' });
        }
        next(error);
    }
};
