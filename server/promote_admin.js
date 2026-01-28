const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path if needed
const dotenv = require('dotenv');

dotenv.config();

const promoteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // CHANGE THIS EMAIL to the user's email
        const userEmail = process.argv[2];

        if (!userEmail) {
            console.log('Please provide an email: node promote_admin.js <email>');
            process.exit(1);
        }

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            console.log(`User with email ${userEmail} not found!`);
            process.exit(1);
        }

        user.role = 'institution_admin';
        await user.save();

        console.log(`✅ SUCCESS: User ${user.name} (${userEmail}) is now an ADMIN.`);
        console.log('You can now access the dashboard at /admin');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

promoteUser();
