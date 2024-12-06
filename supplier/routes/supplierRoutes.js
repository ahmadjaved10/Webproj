const express = require('express');
const { login, getDashboard, register } = require('../controllers/supplierController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to register a new supplier
router.post('/register', register);

// Route to login an existing supplier
router.post('/login', login);

// Route to get supplier dashboard (protected)
router.get('/dashboard', authMiddleware, getDashboard);

module.exports = router;
