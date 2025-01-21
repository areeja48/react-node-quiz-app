const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const Result = require('../models/Result');
const cors = require('cors');

// Serve static files from the "public" directory
router.use('/uploads', express.static(path.join(__dirname, 'public')));

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



// Route to fetch the highest scorer's name, score, and picture using findAll() and .map()
router.get('/highestscorer', async (req, res) => {
  try {
    // Fetch all results, joining with the User model to include username and profileImage
    const allResults = await Result.findAll({
      include: [
        {
          model: User, // Assuming the Result model has a relationship with the User model
          attributes: ['username', 'profileImage'], // Include username and profileImage from the User model
        },
      ],
      order: [['score', 'DESC']], // Ordering by score, descending, so highest scorer comes first
    });

    if (!allResults || allResults.length === 0) {
      return res.status(404).json({ error: 'No results found' });
    }

    // Map through the allResults to format the response
    const formattedResults = allResults.map(result => ({
      userId: result.User?.id, // Add userId from User model
      username: result.User?.username, // Add username from User model
      profileImage: result.User?.profileImage, // Add profileImage (Cloudinary URL)
      score: result.score, // Add score from Result model
    }));

    // Return the formatted results
    res.json(formattedResults);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the highest scorer' });
  }
});




module.exports = router;