const express = require('express');
const {
  createRequest,
  getRequests,
  fulfillRequest,
  expireRequest
} = require('../controllers/emergencyRequestController');

const { authorizeSheetWrite } = require('../utils/boltlayer'); // admin API key middleware
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// Public: Create an emergency request (used by registration flow)
router.post('/emergency-request', createRequest);

// Admin-only: list & manage requests
router.get('/admin/emergency-requests', authorizeSheetWrite, getRequests);
router.patch('/admin/emergency-request/:id/fulfill', authorizeSheetWrite, fulfillRequest);
router.patch('/admin/emergency-request/:id/expire', authorizeSheetWrite, expireRequest);


// @route   POST /api/emergency-request/detect-fake
// @desc    Detect fake emergency request
router.post('/emergency-request/detect-fake', require('../controllers/emergencyRequestController').detectFakeRequest);

// @route   POST /api/emergency-request/classify-text
// @desc    Classify emergency text for urgency
router.post('/emergency-request/classify-text', require('../controllers/emergencyRequestController').classifyEmergencyText);

module.exports = router;
