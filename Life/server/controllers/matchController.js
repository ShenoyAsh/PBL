const Patient = require('../models/Patient');
const Donor = require('../models/Donor');
const { sendAlertEmail } = require('../utils/emailHelper');

// --- Blood Type Compatibility Matrix ---
// Key: Patient's Blood Type
// Value: Array of compatible DONOR blood types
const compatibilityMatrix = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'], // Universal Donor (but can only receive O-)
};

/**
 * Find compatible donors
 */
const findMatch = async (req, res) => {
  const { patientId, radiusKm } = req.query;

  if (!patientId) {
    return res.status(400).json({ message: 'Patient ID is required' });
  }

  const radiusMeters = (radiusKm || 10) * 1000; // Default 10km

  try {
    // 1. Get Patient Details
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // 2. Determine compatible blood types
    const compatibleTypes = compatibilityMatrix[patient.bloodType];
    if (!compatibleTypes) {
      return res.status(400).json({ message: 'Invalid patient blood type' });
    }
    
    // 3. Get Patient's coordinates
    const patientCoords = patient.location.coordinates; // [lng, lat]

    // 4. Run Geospatial Aggregation
    const matches = await Donor.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: patientCoords,
          },
          distanceField: 'distanceMeters', // Output field with distance in meters
          maxDistance: radiusMeters,
          spherical: true,
          // Query filters are applied *before* geoNear
          query: {
            bloodType: { $in: compatibleTypes },
            verified: true,
            otpVerified: true,
            availability: true,
          },
        },
      },
      {
        // Sort by distance (nearest first)
        $sort: { distanceMeters: 1 },
      },
      {
        // Project to shape the output
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          bloodType: 1,
          location: 1,
          availability: 1,
          distanceKm: { $divide: ['$distanceMeters', 1000] }, // Convert to KM
          // Exclude sensitive fields
          otp: 0,
          otpExpires: 0,
        },
      },
    ]);

    res.status(200).json(matches);

  } catch (error) {
    console.error('Find match error:', error);
    res.status(500).json({ message: 'Server error finding matches' });
  }
};

/**
 * Send an alert to a matched donor
 */
const sendAlert = async (req, res) => {
  const { donorId, patientId } = req.body;

  try {
    const donor = await Donor.findById(donorId);
    const patient = await Patient.findById(patientId);

    if (!donor || !patient) {
      return res.status(404).json({ message: 'Donor or Patient not found' });
    }

    // --- 1. Send Email Alert ---
    const emailSent = await sendAlertEmail(donor, patient);

    // --- 2. Simulate SMS Alert (Log only) ---
    console.log(`--- SIMULATED SMS PAYLOAD ---`);
    console.log(`TO: ${donor.phone}`);
    console.log(`BODY: URGENT: LifeLink match for patient ${patient.name} (${patient.bloodType}) near you. Check email for details.`);
    console.log(`-------------------------------`);
    
    // --- 3. Log alert in Excel (Optional - complex operation) ---
    // We could create a third 'Alerts' sheet and append to it.
    // appendToAlertsSheet({ donorId, patientId, time: new Date() });

    if (emailSent) {
      res.status(200).json({ message: 'Alert sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send alert email' });
    }

  } catch (error) {
    console.error('Send alert error:', error);
    res.status(500).json({ message: 'Server error sending alert' });
  }
};

module.exports = {
  findMatch,
  sendAlert,
};