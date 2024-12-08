// promotionRoutes.js
const express = require('express');
const { createPromotion, getPromotions, updatePromotion, deletePromotion, getPromotionById } = require('../controllers/promotionController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', createPromotion); // Create a promotion
router.get('/', getPromotions); // Get all promotions
router.get('/:id', getPromotionById); // Get a specific promotion by ID
router.put('/:id', updatePromotion); // Update a specific promotion
router.delete('/:id', deletePromotion); // Delete a specific promotion

module.exports = router;