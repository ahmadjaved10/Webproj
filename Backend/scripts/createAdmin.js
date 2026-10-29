require('dotenv').config();

const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const main = async () => {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME?.trim() || 'Administrator';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Set a valid ADMIN_EMAIL before creating the admin account.');
    }
    if (!password || password.length < 12) {
        throw new Error('Set an ADMIN_PASSWORD with at least 12 characters before creating the admin account.');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is required to create the admin account.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    if (await Admin.exists({ email })) {
        throw new Error(`An admin account already exists for ${email}.`);
    }

    await Admin.create({ name, email, password });
    console.log(`Admin account created for ${email}.`);
};

main()
    .catch((error) => {
        console.error(`Admin setup failed: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });
