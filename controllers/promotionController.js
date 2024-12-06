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
