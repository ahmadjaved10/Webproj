const express = require('express');
const { createPromotion, getPromotions } = require('../controllers/promotionController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', createPromotion);
router.get('/', getPromotions);

module.exports = router;
