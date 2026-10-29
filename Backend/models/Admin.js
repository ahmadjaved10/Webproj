const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
}, { timestamps: true });

adminSchema.pre('save', async function hashPassword() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
});

adminSchema.methods.comparePassword = function comparePassword(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
