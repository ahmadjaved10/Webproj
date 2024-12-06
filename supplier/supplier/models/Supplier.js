const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    profilePicture: { type: String },
    operationalHours: {
        startTime: { type: String },
        endTime: { type: String },
    },
    paymentInfo: {
        bankAccount: { type: String },
        walletDetails: { type: String },
    },
    businessVerification: {
        documentURL: { type: String },
        isVerified: { type: Boolean, default: false },
    },
}, { timestamps: true });

// Compare password directly without hashing
supplierSchema.methods.comparePassword = function (password) {
    return password === this.password;  // Compare plain text password with the stored one
};

// Generate authentication token for login
supplierSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { id: this._id }, // The payload with user id
        process.env.JWT_SECRET, // Secret key for JWT, defined in .env file
        { expiresIn: '1h' } // Expiration time (e.g., 1 hour)
    );
    return token;
};

module.exports = mongoose.model('Supplier', supplierSchema);
