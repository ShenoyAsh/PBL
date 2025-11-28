const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  registerUser, 
  loginUser, 
  getMe,
  registerDonor, 
  verifyDonorOTP,
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.get('/me', protect, getMe);

// Donor registration routes
router.post('/register-donor', protect, registerDonor);
router.post('/verify-donor-otp/:id', protect, verifyDonorOTP);

module.exports = router;
