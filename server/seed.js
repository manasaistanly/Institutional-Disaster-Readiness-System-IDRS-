const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedAdmins = async () => {
    try {
        await User.deleteMany({ email: { $in: ['admin@example.com', 'inst_admin@test.com'] } });

        const superAdmin = await User.create({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: 'adminpassword',
            role: 'super_admin'
        });

        const instAdmin = await User.create({
            name: 'Institution Admin',
            email: 'inst@example.com',
            password: 'instpassword',
            role: 'institution_admin'
        });

        console.log('-----------------------------------');
        console.log('ADMIN ACCOUNTS CREATED SAFELY');
        console.log('-----------------------------------');
        console.log(`Super Admin:      admin@example.com  / adminpassword`);
        console.log(`Institution Admin: inst@example.com   / instpassword`);
        console.log('-----------------------------------');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmins();
