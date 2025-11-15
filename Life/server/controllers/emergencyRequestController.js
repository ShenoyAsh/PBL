const EmergencyRequest = require('../models/EmergencyRequest');
const Patient = require('../models/Patient');
const Donor = require('../models/Donor');
const { sendAlertEmail } = require('../utils/emailHelper');

// Create a new emergency request
const createRequest = async (req, res) => {
  try {
    const {
      patientId,
      requiredBloodType,
      organNeeded,
      urgency,
      locationName,
      lat,
      lng
    } = req.body;

    // Validate patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Create request
    const newReq = new EmergencyRequest({
      patientId,
      requiredBloodType,
      organNeeded: organNeeded || 'None',
      urgency,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
        name: locationName
      }
    });

    await newReq.save();

    res.status(201).json({
      message: 'Emergency request posted successfully.',
      request: newReq
    });

  } catch (err) {
    console.error('Error creating emergency request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all active (Pending) requests
const getActiveRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({ status: 'Pending' })
      .sort({ urgency: -1, timePosted: 1 })
      .populate('patientId');

    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark request as fulfilled
const fulfillRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRequest = await EmergencyRequest.findByIdAndUpdate(
      id,
      { status: 'Fulfilled' },
      { new: true }
    );

    if (!updatedRequest) return res.status(404).json({ message: 'Request not found' });

    res.status(200).json({ message: 'Request marked as fulfilled', request: updatedRequest });

  } catch (err) {
    console.error('Fulfillment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Expire old requests manually
const expireRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRequest = await EmergencyRequest.findByIdAndUpdate(
      id,
      { status: 'Expired' },
      { new: true }
    );

    if (!updatedRequest) return res.status(404).json({ message: 'Request not found' });

    res.status(200).json({ message: 'Request expired', request: updatedRequest });

  } catch (err) {
    console.error('Expire error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRequest,
  getActiveRequests,
  fulfillRequest,
  expireRequest,
};
