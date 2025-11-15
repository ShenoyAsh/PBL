const express = require('express');
const {
  createRequest,
  getActiveRequests,
  fulfillRequest,
  expireRequest
} = require('../controllers/emergencyRequestController');

const router = express.Router();

// @route POST /api/emergency-request
router.post('/emergency-request', createRequest);

// @route GET /api/emergency-requests
router.get('/emergency-requests', getActiveRequests);

// @route PATCH /api/emergency-request/:id/fulfill
router.patch('/emergency-request/:id/fulfill', fulfillRequest);

// @route PATCH /api/emergency-request/:id/expire
router.patch('/emergency-request/:id/expire', expireRequest);

module.exports = router;
