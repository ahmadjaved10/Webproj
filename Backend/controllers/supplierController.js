const Supplier = require('../models/Supplier');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, address, profilePicture, operationalHours, paymentInfo, businessVerification } = req.body;
        if (typeof name !== 'string' || !name.trim() ||
            typeof email !== 'string' ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
            typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ message: 'Name, valid email, and a password of at least 8 characters are required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingSupplier = await Supplier.findOne({ email: normalizedEmail });
        if (existingSupplier) {
            return res.status(400).json({ message: 'Supplier already exists with this email' });
        }

        const newSupplier = new Supplier({
            name: name.trim(),
            email: normalizedEmail,
            password,
            approvalStatus: 'Pending',
            phone,
            address,
            profilePicture,
            operationalHours,
            paymentInfo,
            businessVerification
        });

        await newSupplier.save();
        res.status(201).json({
            message: 'Your supplier application was submitted and is waiting for admin approval.',
            approvalStatus: newSupplier.approvalStatus,
            supplier: { id: newSupplier._id, name: newSupplier.name, email: newSupplier.email },
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const supplier = await Supplier.findOne({ email: email.trim().toLowerCase() });
        
        if (!supplier) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!(await supplier.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (supplier.approvalStatus !== 'Approved') {
            const message = supplier.approvalStatus === 'Rejected'
                ? 'Your supplier application was not approved. Contact support for more information.'
                : 'Your supplier application is awaiting admin approval.';
            return res.status(403).json({ message, approvalStatus: supplier.approvalStatus });
        }

        if (!/^\$2[aby]\$/.test(supplier.password)) {
            supplier.password = password;
            await supplier.save();
        }

        const token = supplier.generateAuthToken();
        res.json({
            token,
            role: 'supplier',
            supplier: { id: supplier._id, name: supplier.name, email: supplier.email },
        });
    } catch (error) {
        next(error);
    }
};

exports.getDashboard = async (req, res, next) => {
    try {
        const supplier = req.user;
        res.json({ message: 'Dashboard metrics go here', supplier });
    } catch (error) {
        next(error);
    }
};
