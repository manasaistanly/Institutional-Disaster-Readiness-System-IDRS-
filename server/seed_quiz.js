const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Quiz } = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const seedQuizzes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find an admin user to assign as creator
        const admin = await User.findOne({ role: 'super_admin' }) || await User.findOne({ role: 'institution_admin' });

        if (!admin) {
            console.error('No admin found to assign quiz to. Please create an admin first.');
            process.exit(1);
        }

        const sampleQuiz = {
            title: "Basic Fire Safety",
            description: "Essential knowledge for handling fire emergencies.",
            createdBy: admin._id,
            questions: [
                {
                    questionText: "What is the first thing you should do when you hear a fire alarm?",
                    options: [
                        "Ignore it and wait for instructions",
                        "Evacuate immediately via the nearest exit",
                        "Run to the roof",
                        "Hide under a desk"
                    ],
                    correctOptionIndex: 1
                },
                {
                    questionText: "Which type of fire extinguisher is used for electrical fires?",
                    options: [
                        "Water",
                        "Foam",
                        "CO2 (Carbon Dioxide)",
                        "Wet Chemical"
                    ],
                    correctOptionIndex: 2
                },
                {
                    questionText: "What does the 'PASS' technique stand for?",
                    options: [
                        "Pull, Aim, Squeeze, Sweep",
                        "Push, Aim, Shoot, Stop",
                        "Pull, Alarm, Shout, Sprint",
                        "Pass, Ask, Speak, Solve"
                    ],
                    correctOptionIndex: 0
                }
            ]
        };

        await Quiz.deleteMany({}); // Clear existing quizzes to avoid duplicates if re-run
        await Quiz.create(sampleQuiz);

        console.log('Sample Quiz Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding quiz:', error);
        process.exit(1);
    }
};

seedQuizzes();
