const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const Result = require('../models/Result');
const cors = require('cors');

// Serve static files from the "uploads" directory
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to create a result (after quiz completion)
router.post('/submitscore', async (req, res) => {
  const { username, score, userAnswer, attemptedQuestions, correctAnswers, wrongAnswers } = req.body;

  // Validate input
  if (!username || score === undefined) {
    return res.status(400).json({ error: 'Username and score are required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.error(`User not found: ${username}`);
      return res.status(400).json({ error: 'User does not exist' });
    }

    // Create the result in the database
    const result = await Result.create({
      userId: user.id,
      score,
      userAnswer: userAnswer || null, // Optional
      attemptedQuestions: attemptedQuestions || null, // Optional
      correctAnswers: correctAnswers, // Optional
      wrongAnswers: wrongAnswers // Optional
    });
    console.log('Score submitted:', result);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error while saving score:', error);
    res.status(500).json({ error: 'An error occurred while saving the score' });
  }
});
/// Route to fetch all results with corresponding user id and username
router.get('/users/results', async (req, res) => {
  try {
    // Fetch all results, including user information
    const results = await Result.findAll({
      include: [
        {
          model: User, // Assuming the Result model has a relationship with the User model
          attributes: ['id', 'username'], // Include user id and username
        },
      ],
      order: [['createdAt', 'DESC']], // Order results by timestamp, latest first
    });

    if (!results.length) {
      return res.status(404).json({ error: 'No results found' });
    }

    // Format and return all results with user information
    const formattedResults = results.map(result => ({
      ...result.toJSON(), // Include all columns from the Result table
      userId: result.User?.id, // Add user ID
      username: result.User?.username, // Add username
    }));

    res.json({ results: formattedResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching results' });
  }
});



// Route to fetch the highest scorer's name, score, and picture
router.get('/highestscorer', async (req, res) => {
  try {
    const highestScorerResult = await Result.findOne({
     
 order: [['score', 'DESC']],  // Sorting results by score in descending order
      limit: 1,  // Only the highest scorer
      include: {
        model: User,
        attributes: ['username', 'profileImage'],  // Including username and profileImage from User model
      },
    });

    if (!highestScorerResult) {
      return res.status(404).json({ error: 'No results found' });
    }

    // Construct the response with the highest scorer's details
    const highestScorer = {
      username: highestScorerResult.User.username,  // User's username
      score: highestScorerResult.score,             // Score from the Result model
      // Fix the profile image URL, replace backslashes and ensure the URL is correct
      profileImage: highestScorerResult.User.profileImage ? 
        `${req.protocol}://${req.get('host')}/uploads/${path.basename(highestScorerResult.User.profileImage)}` : 
        null,  // Ensure proper URL format for the profile image (replace backslashes)
    };

    res.json(highestScorer);  // Send back the highest scorer's information
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the highest scorer' });
  }
});


module.exports = router;