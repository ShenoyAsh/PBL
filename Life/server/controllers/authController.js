const User = require('../models/User');
const Donor = require('../models/Donor');
const { validatePhone, validateEmail } = require('../utils/validate');
const { generateOTP, getOTPExpiry } = require('../utils/otpHelper');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/emailHelper');
const { appendDonorToExcel } = require('../utils/excelHelper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  // FIX: Extract role from body
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with the specific role
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : (role || 'user'), // Preserve admin role if provided
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate request
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Register a new donor (existing functionality)
const registerDonor = async (req, res) => {
  const { name, email, phone, bloodType, locationName, lat, lng, availability } = req.body;

  // --- 1. Validation ---
  if (!name || !email || !phone || !bloodType || !locationName || !lat || !lng) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (!validatePhone(phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
  }

  try {
    // Check for existing user
    let existingDonor = await Donor.findOne({ $or: [{ email }, { phone }] });
    if (existingDonor) {
      return res.status(409).json({ message: 'Email or phone number already registered' });
    }

    // --- 2. OTP Generation ---
    const otp = generateOTP();
    const otpExpires = getOTPExpiry();

    // --- 3. Create Donor in MongoDB ---
    const newDonor = new Donor({
      name,
      email,
      phone,
      bloodType,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
        name: locationName,
      },
      availability: availability ?? true,
      otp: otp, 
      otpExpires,
    });
    
    await newDonor.save();

    // --- 4. Sync to Excel (Atomic Append) ---
    appendDonorToExcel(newDonor);

    // --- 5. Send OTP Email ---
    const emailSent = await sendOTPEmail(email, otp);

    res.status(201).json({
      message: 'Donor registered. Please check your email for OTP.',
      donorId: newDonor._id,
      emailSent: emailSent,
    });

  } catch (error) {
    console.error('Donor registration error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email or phone already exists.' });
    }
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

/**
 * Verify Donor OTP
 */
const verifyDonorOTP = async (req, res) => {
  const { id } = req.params;
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  try {
    const donor = await Donor.findById(id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    if (donor.otpVerified) {
      return res.status(400).json({ message: 'Donor already verified' });
    }

    if (donor.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const isMatch = donor.otp === otp;

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    donor.otpVerified = true;
    donor.verified = true; 
    donor.otp = undefined; 
    donor.otpExpires = undefined;
    
    await donor.save();

    res.status(200).json({ message: 'Donor verified successfully' });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Request password reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user found with that email' });
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; 
    await user.save();
    await sendPasswordResetEmail(user.email, resetToken);
    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

// @desc    Reset password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token and new password required' });
  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  registerDonor,
  verifyDonorOTP,
  requestPasswordReset,
  resetPassword,
};