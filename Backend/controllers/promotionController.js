const Promotion = require('../models/Promotion');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const validatePromotion = async (data, supplierId) => {
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    const discountPercentage = Number(data.discountPercentage);
    const products = Array.isArray(data.products) ? [...new Set(data.products.map(String))] : [];

    if (!title) {
        return { error: 'Promotion title is required.' };
    }
    if (!Number.isFinite(discountPercentage) || discountPercentage <= 0 || discountPercentage > 100) {
        return { error: 'Discount must be greater than 0 and no more than 100 percent.' };
    }
    if (products.length === 0 || products.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
        return { error: 'Select at least one valid product for this promotion.' };
    }

    const productCount = await Product.countDocuments({
        _id: { $in: products },
        supplierId,
    });
    if (productCount !== products.length) {
        return { error: 'Promotions can only include your own products.' };
    }

    const startDate = data.startDate ? new Date(data.startDate) : undefined;
    const endDate = data.endDate ? new Date(data.endDate) : undefined;
    if ((startDate && Number.isNaN(startDate.getTime())) ||
        (endDate && Number.isNaN(endDate.getTime()))) {
        return { error: 'Enter valid promotion dates.' };
    }
    if (startDate && endDate && startDate >= endDate) {
        return { error: 'Promotion end date must be after its start date.' };
    }
    if (!['Active', 'Expired'].includes(data.status || 'Active')) {
        return { error: 'Choose a valid promotion status.' };
    }

    return {
        value: {
            title,
            description: data.description || '',
            products,
            discountPercentage,
            startDate: startDate || null,
            endDate: endDate || null,
            status: data.status || 'Active',
        },
    };
};

exports.createPromotion = async (req, res, next) => {
    try {
        const validation = await validatePromotion(req.body, req.user._id);
        if (validation.error) {
            return res.status(400).json({ message: validation.error });
        }

        const promotion = new Promotion({ ...validation.value, supplierId: req.user._id });
        await promotion.save();
        res.status(201).json(promotion);
    } catch (error) {
        next(error);
    }
};

exports.getPromotions = async (req, res, next) => {
    try {
        const promotions = await Promotion.find({ supplierId: req.user._id });
        res.status(200).json(promotions);
    } catch (error) {
        next(error);
    }
};

// New method to update a promotion
exports.updatePromotion = async (req, res, next) => {
    try {
        const validation = await validatePromotion(req.body, req.user._id);
        if (validation.error) {
            return res.status(400).json({ message: validation.error });
        }

        const updatedPromotion = await Promotion.findOneAndUpdate(
            { _id: req.params.id, supplierId: req.user._id },
            validation.value,
            { new: true, runValidators: true }
        );
        if (!updatedPromotion) return res.status(404).json({ message: 'Promotion not found' });
        res.status(200).json(updatedPromotion);
    } catch (error) {
        next(error);
    }
};

// Method to delete a promotion
exports.deletePromotion = async (req, res, next) => {
    try {
        const deletedPromotion = await Promotion.findOneAndDelete({
            _id: req.params.id,
            supplierId: req.user._id,
        });
        if (!deletedPromotion) return res.status(404).json({ message: 'Promotion not found' });
        res.status(200).json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getPromotionById = async (req, res, next) => {
    try {
        const promotion = await Promotion.findOne({
            _id: req.params.id,
            supplierId: req.user._id,
        });
        if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
        res.status(200).json(promotion);
    } catch (error) {
        next(error);
    }
};