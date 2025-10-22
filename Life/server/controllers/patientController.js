const Patient = require('../models/Patient');
const { validatePhone, validateEmail } = require('../utils/validate');
const { appendPatientToExcel } = require('../utils/excelHelper');

/**
 * Register a new patient
 */
const registerPatient = async (req, res) => {
  const { name, email, phone, bloodType, locationName, lat, lng, urgency } = req.body;

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
    // --- 2. Create Patient in MongoDB ---
    const newPatient = new Patient({
      name,
      email,
      phone,
      bloodType,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
        name: locationName,
      },
      urgency: urgency || 'Medium',
    });

    await newPatient.save();

    // --- 3. Sync to Excel (Atomic Append) ---
    appendPatientToExcel(newPatient);

    res.status(201).json({
      message: 'Patient registered successfully.',
      patientId: newPatient._id,
    });

  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

/**
 * Get all patients
 */
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerPatient,
  getPatients,
};