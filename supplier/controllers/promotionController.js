const Promotion = require('../models/Promotion');

exports.createPromotion = async (req, res, next) => {
    try {
        const promotion = new Promotion({ ...req.body, supplierId: req.user._id });
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
        const { id } = req.params;
        const updatedPromotion = await Promotion.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPromotion) return res.status(404).json({ message: 'Promotion not found' });
        res.status(200).json(updatedPromotion);
    } catch (error) {
        next(error);
    }
};

// Method to delete a promotion
exports.deletePromotion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedPromotion = await Promotion.findByIdAndDelete(id);
        if (!deletedPromotion) return res.status(404).json({ message: 'Promotion not found' });
        res.status(200).json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getPromotionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const promotion = await Promotion.findById(id);
        if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
        res.status(200).json(promotion);
    } catch (error) {
        next(error);
    }
};