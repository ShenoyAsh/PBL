const Donor = require('../models/Donor');
const { validatePhone, validateEmail } = require('../utils/validate');
const { generateOTP, getOTPExpiry } = require('../utils/otpHelper');
const { sendOTPEmail } = require('../utils/emailHelper');
const { appendDonorToExcel } = require('../utils/excelHelper');
// const bcrypt = require('bcrypt'); // Ready for hashing OTP if needed

/**
 * Register a new donor
 */
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
    // const hashedOTP = await bcrypt.hash(otp, 10); // Use this for production

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
      otp: otp, // Store plain OTP for prototype. Use hashedOTP in production.
      otpExpires,
    });
    
    await newDonor.save();

    // --- 4. Sync to Excel (Atomic Append) ---
    // This happens *after* successful Mongo save
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

    // Check OTP expiry
    if (donor.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // --- OTP Verification ---
    // Plain text check (prototype)
    const isMatch = donor.otp === otp;
    
    // Hashed check (production)
    // const isMatch = await bcrypt.compare(otp, donor.otp);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // --- Success ---
    donor.otpVerified = true;
    donor.verified = true; // Auto-verify on OTP success for this flow
    donor.otp = undefined; // Clear OTP
    donor.otpExpires = undefined;
    
    await donor.save();

    // TODO: We should also update the "verified" status in the Excel file.
    // This requires a read-modify-write operation on the Excel file,
    // which is more complex than simple appends.
    // For now, Mongo is the source of truth for verification status.

    res.status(200).json({ message: 'Donor verified successfully' });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

module.exports = {
  registerDonor,
  verifyDonorOTP,
};