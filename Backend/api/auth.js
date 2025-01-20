const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const router = express.Router();
const app = express();  // Add this line to define the express app

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir), // Use uploads directory
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname), // Unique file name
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  fileFilter,
});

const SECRET_KEY = process.env.SECRET_KEY;   // To use secret key from .env file 

/// User Registration
router.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    let profileImagePath = ''; 

    // If no file is uploaded, set default avatar based on gender
    if (!req.file) {
      if (req.body.gender === 'Male') {
        profileImagePath = 'public/Male.png'; // path to default male avatar
      } else if (req.body.gender === 'Female') {
        profileImagePath = 'public/Female.png'; // path to default female avatar
      } else {
        return res.status(400).json({ error: 'Gender is required to provide default avatar' });
      }
    } else {
      profileImagePath = req.file.path; // Use the uploaded profile image
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      contactno: req.body.contactno,
      gender: req.body.gender,
      city: req.body.city,
      profileImage: profileImagePath, // Store the path to the profile image or default avatar
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = await User.findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create the JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      profileImage: `${req.protocol}://${req.get('host')}/uploads/${path.basename(user.profileImage)}`,
      role: user.role || 'user', // Assuming user has a role field
    }, 
    SECRET_KEY, { expiresIn: '1h' }
  );
  
  // Store the JWT token in the session
  req.session.token = token;

  // Send the token and profile picture URL in the response
  res.json({ token });
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.session.token; // Retrieve token from session
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};

// Admin Dashboard Route
router.get('/admin/dashboard', authenticateToken, authorizeAdmin, (req, res) => {
  res.json({
    message: 'Welcome to the admin dashboard!',
    user: req.user,
  });
});

// Admin Login Route
router.post('/admin', (req, res) => {
  const { username, password } = req.body;

  // Fixed credentials for the admin (you can use a real DB for this)
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  // Generate a new JWT token with the admin role
  const token = jwt.sign({ role: 'admin', username: ADMIN_USERNAME }, SECRET_KEY, { expiresIn: '1h' });

  // Store the JWT token in the session
  req.session.token = token;

  res.json({
    token,
    message: 'Admin login successful Janab!',
  });
});

// JWT Logout (Client must delete the token)

router.post('/logout', (req, res) => {
  if (!req.session || !req.session.token) {
    return res.status(400).json({ message: 'No active session to destroy' });
  }

  // Destroy the session and invalidate the token
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logged out 88successfully' });
  });
});
const nodemailer = require('nodemailer');
const ejs = require('ejs');

//Generate OTP

router.post('/generateOtp', async (req, res) => {
  try {
    const { username, email } = req.body;

    // Find the user by username and email
    const user = await User.findOne({
      where: { username, email }
    });

    // If the user is not found
    if (!user) {
      return res.status(404).send({ message: "User not found with the provided email." });
    }

    // Generate a new 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Set OTP expiry time (10 minutes from now)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expiry time for password reset OTP

    // Save the new OTP and expiry time to the user's record
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Check if the user already has a valid OTP
   /* if (user.otp && new Date(user.otpExpiry) > new Date()) {
      return res.status(400).send({ message: "An OTP is already generated and is still valid." });
    }*/
  
    // Create a transporter for Nodemailer (using Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, //Your Gmail email
        pass: process.env.EMAIL_PASS  // Your Gmail password (Use an App Password if 2-Step Verification is enabled)
      }
    });

    // Render the OTP email using EJS
    const templatePath = path.join(__dirname, '..', 'views', 'otp-email.ejs');
    try {
      // Render the OTP email using EJS template
      const htmlContent = await ejs.renderFile(templatePath, {  username, otp });

      // Send OTP email
      await transporter.sendMail({
        from: process.env.EMAIL_USER, // Sender email address (Gmail)
        to: email,  // Recipient email address
        subject: 'Your OTP for Password Reset',
        html: htmlContent  // Rendered HTML content from EJS
      });

      // Respond with the OTP and expiry time (for testing purposes, do not expose OTP in production)
      return res.status(200).json({
        message: "OTP generated and sent to your email successfully.",
        otp: otp, // Send OTP (for testing, do not expose it directly in production)
        otpExpiry: otpExpiry.toISOString()  // Expiry time in ISO string
      });
    
    
    } catch (error) {
      console.error('Error rendering EJS template:', error);
      res.status(500).send({ message: "Error rendering email template." });
    }
  } catch (err) {
    console.error('Error generating OTP:', err);
    res.status(500).send({ message: "An error occurred while generating and sending the OTP." });
  } ;})



router.post('/reset', async (req, res) => {
  try {
    // Step 1: Find the user by username and email
    const user = await User.findOne({
      where: {
        username: req.body.username,
        email: req.body.email
      },
    });
    
    // If no user is found with the given username and email
    if (!user) {
      return res.status(404).send({ message: "User not found with the provided username and email." });
    }
    
    // Step 2: Check if OTP matches
    const user1= await User.findOne({
      where: {
        otp: req.body.otp
      },
    });
      if (!user1) { 
      return res.status(404).send({ message: "OTP is not matched." });
    }
   
    
    // Step 3: Check if OTP has expired
    const currentDateTime = new Date();
    const otpExpiryDate = new Date(user.otpExpiry); // Convert expiry string to Date object

    if (currentDateTime > otpExpiryDate) {
      return res.status(404).send({ message: "OTP is expired." });
    }
   
    // If all checks passed, update the user's password
   const hashedPassword = await bcrypt.hash(req.body.newPassword, 8); // Assuming bcrypt is used for hashing
   //const Password = await req.body.newPassword; // Assuming bcrypt is used for hashing
   user.password = hashedPassword;  // Update the password field
    user.otp = null;  // Clear OTP after successful reset
    user.otpExpiry = null;  // Clear OTP expiry after reset
    await user.save();  // Save the updated user details

    // Step 4: Send response to user
    res.json({
      message: "Your password has been reset. Please log in with the new password.",
      user: req.body.username,
      password: req.body.newPassword,
      email: req.body.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred while resetting the password." });
  }
});


// Route to save usercomments (after quiz completion)
router.post('/comments', async (req, res) => {
  const { username, usercomments } = req.body;

  // Validate input
  if (!username || usercomments === undefined) {
    return res.status(400).json({ error: 'Username and comments are required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.error(`User not found: ${username}`);
      return res.status(400).json({ error: 'User does not exist' });
    }

    // Create user comments in the database
    user.usercomments = usercomments;  // Ensure the column in the User model is named 'usercomments'
    
    // Save the user with the updated comments
    await user.save();
    
    // Return the saved comments in the response
    res.status(201).json({ usercomments });
  } catch (error) {
    console.error('Error while saving comments:', error);
    res.status(500).json({ error: 'An error occurred while saving the user comments' });
  }
});

// Import Op from Sequelize
const { Op } = require('sequelize');

// Route to fetch all users with their comments, user ID, username, and timestamps
router.get('/admin/usercomments', async (req, res) => {
  try {
    // Fetch all users who have non-null comments, including user comments and timestamps
    const users = await User.findAll({
      where: {
        usercomments: { [Op.ne]: null, [Op.ne]: '' }, // Exclude users with null or empty comments
      },
      attributes: ['id', 'username','email' ,'usercomments', 'createdAt'], // Include user id, username, comments, and creation timestamp
      order: [['createdAt', 'DESC']], // Order results by creation date of user (or comment if that's in the same field)
    });

    if (!users.length) {
      return res.status(404).json({ error: 'No users with comments found' });
    }

    // Format and return all results with user information and comments
    const formattedUsers = users.map(user => ({
      userId: user.id, // Add user ID
      username: user.username, // Add username
      email: user.email, //Add email
      usercomments: user.usercomments, // Add comments
      createdAt: user.createdAt, // Include timestamp for when the user was created (or when comments were added)
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});



module.exports = router;

