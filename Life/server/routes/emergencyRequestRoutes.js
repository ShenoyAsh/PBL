const express = require('express');
const {
  createRequest,
  getRequests,
  fulfillRequest,
  expireRequest
} = require('../controllers/emergencyRequestController');

const { authorizeSheetWrite } = require('../utils/boltlayer'); // admin API key middleware

const router = express.Router();

// Public: Create an emergency request (used by registration flow)
router.post('/emergency-request', createRequest);

// Admin-only: list & manage requests
router.get('/admin/emergency-requests', authorizeSheetWrite, getRequests);
router.patch('/admin/emergency-request/:id/fulfill', authorizeSheetWrite, fulfillRequest);
router.patch('/admin/emergency-request/:id/expire', authorizeSheetWrite, expireRequest);

module.exports = router;
