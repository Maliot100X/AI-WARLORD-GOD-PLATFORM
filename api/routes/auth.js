const express = require('express');
const router = express.Router();
const { 
  authenticate, 
  register, 
  getProfile, 
  updateProfile 
} = require('../controllers/authController');

// Authenticate user
router.post('/auth', authenticate);

// Register user
router.post('/register', register);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', updateProfile);

module.exports = router;