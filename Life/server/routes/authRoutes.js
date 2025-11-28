const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  registerUser, 
  loginUser, 
  getMe,
  registerDonor, 
  verifyDonorOTP 
} = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.get('/me', protect, getMe);

// Donor registration routes
router.post('/register-donor', protect, registerDonor);
router.post('/verify-donor-otp/:id', protect, verifyDonorOTP);

module.exports = router;
