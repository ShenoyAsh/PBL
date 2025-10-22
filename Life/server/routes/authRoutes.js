const express = require('express');
const { registerDonor, verifyDonorOTP } = require('../controllers/authController');
const router = express.Router();

// @route   POST /api/register-donor
// @desc    Register a new donor, send OTP, and sync to Excel+Mongo
router.post('/register-donor', registerDonor);

// @route   POST /api/verify-donor/:id
// @desc    Verify a donor's OTP
router.post('/verify-donor/:id', verifyDonorOTP);

module.exports = router;