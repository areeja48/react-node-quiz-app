const express = require('express');
const session = require('express-session');
const sequelize = require('../config/database'); // Database configuration
const authRoutes = require('./auth');
const questionRoutes = require('./questions');
const resultRoutes = require('./results');
const userRoute = require('./user');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Set up middleware
app.use(cors({ origin: 'https://interactive-quiz-app-iota.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // For URL-encoded bodies
app.use(
  session({
    secret: process.env.SECRET_KEY,  // Use a strong secret string
    resave: false,
    saveUninitialized: true,
  cookie: { secure: true }  // Set to true if using HTTPS // Ensure secure cookies in production
  })
);

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up routes
app.use('/', authRoutes);
app.use('/', questionRoutes);
app.use('/', resultRoutes);
app.use('/', userRoute);

// Export the serverless function module
module.exports = async (req, res) => {
  try {
    await sequelize.authenticate(); // Ensure database connection before handling requests
    return app(req, res); // Pass requests to the Express app
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(500).send('Database connection error');
  }
};
