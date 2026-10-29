const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
}, { timestamps: true });

customerSchema.pre('save', async function hashPassword() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
});

customerSchema.methods.comparePassword = function comparePassword(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);
