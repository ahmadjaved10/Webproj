const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Approved', index: true },
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

supplierSchema.pre('save', async function hashPassword() {
    if (!this.isModified('password') || /^\$2[aby]\$/.test(this.password)) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

supplierSchema.methods.comparePassword = async function comparePassword(password) {
    if (/^\$2[aby]\$/.test(this.password)) {
        return bcrypt.compare(password, this.password);
    }
    return password === this.password;
};

supplierSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, role: 'supplier' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

module.exports = mongoose.model('Supplier', supplierSchema);
