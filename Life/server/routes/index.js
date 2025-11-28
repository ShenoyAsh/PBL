const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const donorRoutes = require('./donorRoutes');
const patientRoutes = require('./patientRoutes');
const matchRoutes = require('./matchRoutes');
const excelRoutes = require('./excelRoutes');

const emergencyRequestRoutes = require('./emergencyRequestRoutes');
const ocrRoutes = require('./ocrRoutes');
const sentimentRoutes = require('./sentimentRoutes');
const chatRoutes = require('./chatRoutes'); // Import chat routes


router.use(authRoutes);
router.use(donorRoutes);
router.use(patientRoutes);
router.use(matchRoutes);
router.use(excelRoutes);
router.use(emergencyRequestRoutes);
router.use(ocrRoutes);
router.use(sentimentRoutes);
router.use(chatRoutes); // Use chat routes

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

module.exports = router;