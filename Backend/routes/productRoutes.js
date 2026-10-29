const express = require('express');
const { addProduct, getProducts, getPublicProducts, updateProduct, deleteProduct, getProductById } = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/public', getPublicProducts);

router.use(authMiddleware, requireRole('supplier'));

router.post('/', addProduct);
router.get('/', getProducts);
router.put('/:id', updateProduct);
router.get('/:id', getProductById); 
router.delete('/:id', deleteProduct);

module.exports = router;
