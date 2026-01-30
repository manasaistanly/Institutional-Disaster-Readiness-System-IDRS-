const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Quiz } = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const userCount = await User.countDocuments();
        console.log(`Total Users: ${userCount}`);

        const quizCount = await Quiz.countDocuments();
        console.log(`Total Quizzes: ${quizCount}`);

        if (quizCount > 0) {
            const quizzes = await Quiz.find();
            console.log('Quizzes found:', JSON.stringify(quizzes, null, 2));
        } else {
            console.log('No quizzes found in the database.');
        }

        process.exit();
    } catch (error) {
        console.error('Error checking data:', error);
        process.exit(1);
    }
};

checkData();
