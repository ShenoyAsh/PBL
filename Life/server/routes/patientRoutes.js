const express = require('express');
const { registerPatient, getPatients } = require('../controllers/patientController');
const router = express.Router();

// @route   POST /api/register-patient
// @desc    Register a new patient and sync to Excel+Mongo
router.post('/register-patient', registerPatient);

// @route   GET /api/patients
// @desc    Get list of all patients
router.get('/patients', getPatients);

module.exports = router;