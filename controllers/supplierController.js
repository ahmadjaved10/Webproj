const Supplier = require('../models/Supplier');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, address, profilePicture, operationalHours, paymentInfo, businessVerification } = req.body;
        
        // Check if the supplier already exists by email
        const existingSupplier = await Supplier.findOne({ email });
        if (existingSupplier) {
            return res.status(400).json({ message: 'Supplier already exists with this email' });
        }

        // Create a new supplier with the plain text password
        const newSupplier = new Supplier({
            name,
            email,
            password,  // Store the plain text password
            phone,
            address,
            profilePicture,
            operationalHours,
            paymentInfo,
            businessVerification
        });

        // Save the supplier to the database
        await newSupplier.save();

        // Generate an authentication token
        const token = newSupplier.generateAuthToken();

        // Respond with the token and the supplier data
        res.status(201).json({ message: 'Supplier registered successfully', token, supplier: newSupplier });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const supplier = await Supplier.findOne({ email });
        
        if (!supplier) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Directly compare the plain text passwords
        if (password !== supplier.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token using the supplier instance method
        const token = supplier.generateAuthToken();
        res.json({ token, supplier });
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
