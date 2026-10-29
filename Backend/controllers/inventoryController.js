const mongoose = require('mongoose');
const InventoryLog = require('../models/InventoryLog');
const Product = require('../models/Product');

const getInventoryDelta = ({ changeType, changeQuantity }) => {
    const quantity = Number(changeQuantity);
    if (!['Add', 'Remove', 'Restock'].includes(changeType) ||
        !Number.isInteger(quantity) ||
        quantity <= 0) {
        return null;
    }

    return changeType === 'Remove' ? -quantity : quantity;
};

const updateProductStock = async ({ productId, supplierId, delta }) => {
    const filter = { _id: productId, supplierId };
    if (delta < 0) {
        filter.stock = { $gte: -delta };
    }

    const product = await Product.findOneAndUpdate(
        filter,
        { $inc: { stock: delta } },
        { new: true, runValidators: true }
    );

    if (product) {
        return product;
    }

    const ownedProduct = await Product.exists({ _id: productId, supplierId });
    if (!ownedProduct) {
        return null;
    }

    return false;
};

const rollbackProductStock = async ({ productId, supplierId, delta }) => {
    await Product.updateOne(
        { _id: productId, supplierId },
        { $inc: { stock: -delta } }
    );
};

// Add a stock movement and keep the product's current stock in sync.
exports.addInventoryLog = async (req, res, next) => {
    try {
        const { productId, changeType, changeQuantity } = req.body;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Select a valid product.' });
        }

        const delta = getInventoryDelta({ changeType, changeQuantity });
        if (delta === null) {
            return res.status(400).json({
                message: 'Choose a valid change type and enter a positive whole-number quantity.',
            });
        }

        const product = await updateProductStock({
            productId,
            supplierId: req.user._id,
            delta,
        });

        if (product === false) {
            return res.status(400).json({ message: 'Cannot remove more stock than the product has.' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Product not found for this supplier.' });
        }

        const log = new InventoryLog({
            supplierId: req.user._id,
            productId,
            changeType,
            changeQuantity: Number(changeQuantity),
            remainingStock: product.stock,
        });

        try {
            await log.save();
        } catch (error) {
            await rollbackProductStock({ productId, supplierId: req.user._id, delta });
            throw error;
        }

        res.status(201).json(log);
    } catch (error) {
        next(error);
    }
};

// Get all inventory logs for a supplier.
exports.getInventoryLogs = async (req, res, next) => {
    try {
        const logs = await InventoryLog.find({ supplierId: req.user._id })
            .populate('productId', 'name');
        res.status(200).json(logs);
    } catch (error) {
        next(error);
    }
};

// Get an inventory log by ID.
exports.getInventoryLogById = async (req, res, next) => {
    try {
        const log = await InventoryLog.findOne({
            _id: req.params.id,
            supplierId: req.user._id,
        });
        if (!log) {
            return res.status(404).json({ message: 'Inventory log not found.' });
        }
        res.status(200).json(log);
    } catch (error) {
        next(error);
    }
};

// Update a stock movement and adjust the product by the difference.
exports.updateInventoryLog = async (req, res, next) => {
    try {
        const log = await InventoryLog.findOne({
            _id: req.params.id,
            supplierId: req.user._id,
        });
        if (!log) {
            return res.status(404).json({ message: 'Inventory log not found.' });
        }

        if (String(req.body.productId) !== String(log.productId)) {
            return res.status(400).json({ message: 'An inventory log cannot be moved to another product.' });
        }

        const nextDelta = getInventoryDelta(req.body);
        if (nextDelta === null) {
            return res.status(400).json({
                message: 'Choose a valid change type and enter a positive whole-number quantity.',
            });
        }

        const previousDelta = getInventoryDelta(log);
        const delta = nextDelta - previousDelta;
        let product = await Product.findOne({ _id: log.productId, supplierId: req.user._id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found for this supplier.' });
        }

        if (delta !== 0) {
            product = await updateProductStock({
                productId: log.productId,
                supplierId: req.user._id,
                delta,
            });
            if (product === false) {
                return res.status(400).json({ message: 'The updated movement would make stock negative.' });
            }
            if (!product) {
                return res.status(404).json({ message: 'Product not found for this supplier.' });
            }
        }

        log.changeType = req.body.changeType;
        log.changeQuantity = Number(req.body.changeQuantity);
        log.remainingStock = product.stock;
        try {
            await log.save();
        } catch (error) {
            if (delta !== 0) {
                await rollbackProductStock({
                    productId: log.productId,
                    supplierId: req.user._id,
                    delta,
                });
            }
            throw error;
        }

        res.status(200).json(log);
    } catch (error) {
        next(error);
    }
};

// Delete a stock movement by reversing its effect on the product.
exports.deleteInventoryLog = async (req, res, next) => {
    try {
        const log = await InventoryLog.findOne({
            _id: req.params.id,
            supplierId: req.user._id,
        });
        if (!log) {
            return res.status(404).json({ message: 'Inventory log not found.' });
        }

        const delta = -getInventoryDelta(log);
        const product = await updateProductStock({
            productId: log.productId,
            supplierId: req.user._id,
            delta,
        });

        if (product === false) {
            return res.status(400).json({
                message: 'Cannot delete this log because reversing it would make product stock negative.',
            });
        }
        if (!product) {
            return res.status(404).json({ message: 'Product not found for this supplier.' });
        }

        try {
            await log.deleteOne();
        } catch (error) {
            await rollbackProductStock({
                productId: log.productId,
                supplierId: req.user._id,
                delta,
            });
            throw error;
        }

        res.status(200).json({ message: 'Inventory log deleted and product stock reverted.' });
    } catch (error) {
        next(error);
    }
};
