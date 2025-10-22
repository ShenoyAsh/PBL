const express = require('express');
const { exportDonorsAndPatients, importDonorsAndPatients } = require('../controllers/excelController');
const { authorizeSheetWrite } = require('../utils/boltlayer');
const multer = require('multer');

const router = express.Router();
// Use memory storage for multer to process file as buffer
const upload = multer({ storage: multer.memoryStorage() });

// @route   GET /api/export/excel
// @desc    Export Donors and Patients sheets (Admin Only)
router.get('/export/excel', authorizeSheetWrite, exportDonorsAndPatients);

// @route   POST /api/import/excel
// @desc    Import/Update Donors/Patients from Excel (Admin Only)
router.post('/import/excel', authorizeSheetWrite, upload.single('excelFile'), importDonorsAndPatients);


module.exports = router;