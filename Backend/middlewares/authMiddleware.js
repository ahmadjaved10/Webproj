const jwt = require('jsonwebtoken');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

const roleModels = { supplier: Supplier, customer: Customer, admin: Admin };

exports.authMiddleware = async (req, res, next) => {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const role = decoded.role || 'supplier';
        const Model = roleModels[role];
        if (!Model) {
            return res.status(401).json({ message: 'Invalid authentication role.' });
        }

        req.user = await Model.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'Account no longer exists.' });
        }
        if (role === 'supplier' && req.user.approvalStatus !== 'Approved') {
            return res.status(403).json({ message: 'Your supplier account is not approved.' });
        }
        req.authRole = role;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
        next(error);
    }
};

exports.requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.authRole)) {
        return res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }
    next();
};
