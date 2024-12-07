const express = require('express');
const { addProduct, getProducts, updateProduct, deleteProduct,getProductById } = require('../controllers/productController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', addProduct);
router.get('/', getProducts);
router.put('/:id', updateProduct);
router.get('/:id', getProductById); 
router.delete('/:id', deleteProduct);

module.exports = router;
