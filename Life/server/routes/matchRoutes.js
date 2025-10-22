const express = require('express');
const { findMatch, sendAlert } = require('../controllers/matchController');
const router = express.Router();

// @route   GET /api/find-match
// @desc    Find compatible donors for a patient using geospatial query
// @query   patientId=<id>&radiusKm=<km>
router.get('/find-match', findMatch);

// @route   POST /api/send-alert
// @desc    Send an alert to a matched donor
router.post('/send-alert', sendAlert);

module.exports = router;