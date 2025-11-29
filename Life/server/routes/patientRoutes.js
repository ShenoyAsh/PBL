const express = require('express');
const { registerPatient, getPatients } = require('../controllers/patientController');
const router = express.Router();

// @route   POST /api/patients/register  <-- Simplified path
// @desc    Register a new patient
router.post('/register', registerPatient);

// @route   GET /api/patients
// @desc    Get list of all patients
router.get('/patients', getPatients);

module.exports = router;