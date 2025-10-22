const crypto = require('crypto');

// Generates a 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Generates an expiry date (10 minutes from now)
const getOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

module.exports = {
  generateOTP,
  getOTPExpiry,
};