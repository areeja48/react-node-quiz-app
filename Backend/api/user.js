const express = require('express');
const router = express.Router(); // Initialize the router
const User = require('../models/User');



// Export the handler as a serverless function
module.exports = async (req, res) => {
    return router(req, res); // Pass the request and response to the Express router
  };
  