const express = require('express');
const Question = require('../models/question'); // Assuming the model is named `question.js`
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { questionText, choiceA, choiceB, choiceC, choiceD, correctChoice } = req.body;
    
    // Create the new question
    const question = await Question.create({
      questionText,
      choiceA,
      choiceB,
      choiceC,
      correctChoice
    });

    return res.status(201).json(question);  // Respond with the created question
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add question" });
  }
});

router.get('/', async (req, res) => {
  try {
    const questions = await Question.findAll();  // Fetch all questions from the database
    res.json(questions);  // Send the questions in the response
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

// Export the handler as a serverless function
module.exports = async (req, res) => {
  return router(req, res); // Pass the request and response to the Express router
};
