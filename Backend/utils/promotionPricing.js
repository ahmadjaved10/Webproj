const Promotion = require('../models/Promotion');

const isLivePromotion = (promotion, now = new Date()) => (
    promotion.status === 'Active' &&
    (!promotion.startDate || new Date(promotion.startDate) <= now) &&
    (!promotion.endDate || new Date(promotion.endDate) >= now)
);

const getPromotionPricing = (product, promotions, now = new Date()) => {
    const productId = String(product._id);
    const promotion = promotions
        .filter((candidate) => (
            candidate.products.some((id) => String(id) === productId) &&
            isLivePromotion(candidate, now)
        ))
        .sort((left, right) => right.discountPercentage - left.discountPercentage)[0];

    const discountPercentage = promotion ? promotion.discountPercentage : 0;
    const price = Number(product.price);

    return {
        basePrice: price,
        effectivePrice: Number((price * (1 - discountPercentage / 100)).toFixed(2)),
        discountPercentage,
        promotionTitle: promotion?.title || null,
    };
};

const loadPromotionsForProducts = async (productIds, supplierId) => {
    if (productIds.length === 0) {
        return [];
    }

    const query = {
        products: { $in: productIds },
        status: 'Active',
    };
    if (supplierId) {
        query.supplierId = supplierId;
    }

    return Promotion.find(query).lean();
};

const addPromotionPricing = (products, promotions, now = new Date()) => (
    products.map((product) => ({
        ...product,
        ...getPromotionPricing(product, promotions, now),
    }))
);

module.exports = {
    addPromotionPricing,
    getPromotionPricing,
    isLivePromotion,
    loadPromotionsForProducts,
};
