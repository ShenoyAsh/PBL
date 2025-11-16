// server/controllers/emergencyRequestController.js

const EmergencyRequest = require('../models/EmergencyRequest');
const Patient = require('../models/Patient');

/**
 * Create a new emergency request
 * This is called immediately after patient registration.
 */
const createRequest = async (req, res) => {
  try {
    const {
      patientId,
      requiredBloodType,
      urgency,
      locationName,
      lat,
      lng
    } = req.body;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create the request
    const newReq = new EmergencyRequest({
      patientId,
      requiredBloodType,
      urgency: urgency || 'Medium',
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

  } catch (error) {
    console.error('Error creating emergency request:', error);
    res.status(500).json({ message: 'Server error during emergency request creation' });
  }
};


/**
 * Get emergency requests (admin-only)
 * Supports filters:
 * - bloodType
 * - urgency
 * - status (Pending / Fulfilled / Expired)
 * - geo filter (lat, lng, radiusKm)
 */
const getRequests = async (req, res) => {
  try {
    const { bloodType, urgency, status, lat, lng, radiusKm } = req.query;

    const filter = {};

    // Filter by blood type
    if (bloodType) filter.requiredBloodType = bloodType;

    // Filter by urgency
    if (urgency) filter.urgency = urgency;

    // Filter by status, default = Pending
    filter.status = status || 'Pending';

    // If lat/lng/radius provided, use geospatial filter
    if (lat && lng && radiusKm) {
      const radiusMeters = parseFloat(radiusKm) * 1000;

      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusMeters
        }
      };
    }

    const requests = await EmergencyRequest.find(filter)
      .sort({ timePosted: 1 })
      .populate('patientId');

    res.status(200).json(requests);

  } catch (error) {
    console.error('Error fetching emergency requests:', error);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
};


/**
 * Mark emergency request as fulfilled (admin-only)
 */
const fulfillRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await EmergencyRequest.findByIdAndUpdate(
      id,
      { status: 'Fulfilled' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({
      message: 'Request marked as fulfilled',
      request: updated
    });

  } catch (error) {
    console.error('Error fulfilling request:', error);
    res.status(500).json({ message: 'Server error while fulfilling request' });
  }
};


/**
 * Mark emergency request as expired (admin-only)
 */
const expireRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await EmergencyRequest.findByIdAndUpdate(
      id,
      { status: 'Expired' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({
      message: 'Request marked as expired',
      request: updated
    });

  } catch (error) {
    console.error('Error expiring request:', error);
    res.status(500).json({ message: 'Server error while expiring request' });
  }
};


module.exports = {
  createRequest,
  getRequests,
  fulfillRequest,
  expireRequest,
};
