const jwt = require('jsonwebtoken');
const Supplier = require('../models/Supplier');

exports.authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Supplier.findById(decoded.id).select('-password');
        if (!req.user) return res.status(404).json({ message: 'User not found' });
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
