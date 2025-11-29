const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const donorRoutes = require('./donorRoutes');
const patientRoutes = require('./patientRoutes');
const matchRoutes = require('./matchRoutes');
const excelRoutes = require('./excelRoutes');
const notificationRoutes = require('./notificationRoutes');
const emergencyRequestRoutes = require('./emergencyRequestRoutes');
const ocrRoutes = require('./ocrRoutes');
const sentimentRoutes = require('./sentimentRoutes');
const chatRoutes = require('./chatRoutes');

// Authentication routes
router.use(authRoutes);

// Protected routes (require authentication)
router.use('/donors', donorRoutes);
router.use('/patients', patientRoutes);
router.use('/', matchRoutes);
router.use('/excel', excelRoutes);
router.use('/notifications', notificationRoutes);
router.use(emergencyRequestRoutes);
router.use(ocrRoutes);
router.use(sentimentRoutes);
router.use(chatRoutes); // Use chat routes

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

module.exports = router;