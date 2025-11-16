const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const emergencyRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  requiredBloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  urgency: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium',
  },
  location: {
    type: locationSchema,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Fulfilled', 'Expired'],
    default: 'Pending',
  },
  timePosted: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

emergencyRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
