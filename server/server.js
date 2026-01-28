const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Preparedness Disaster Bot API is running...' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/institutions', require('./routes/institutionRoutes'));
app.use('/api/sops', require('./routes/sopRoutes'));
app.use('/api/drills', require('./routes/drillRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
