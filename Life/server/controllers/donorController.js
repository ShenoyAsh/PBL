const Donor = require('../models/Donor');

/**
 * Get all donors
 */
const getDonors = async (req, res) => {
  try {
    // TODO: Add filters (e.g., ?verified=true)
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.status(200).json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Manually verify a donor (Admin)
 */
const manualVerifyDonor = async (req, res) => {
    const { id } = req.params;
    try {
        const donor = await Donor.findById(id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }
        
        donor.verified = true;
        donor.otpVerified = true; // Assume manual verify also bypasses OTP
        await donor.save();

        // TODO: Update Excel file "verified" status (complex read-modify-write)
        
        res.status(200).json({ message: 'Donor manually verified', donor });

    } catch (error) {
        console.error('Manual verify error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const { geminiRequest } = require('../utils/geminiHelper');
/**
 * Calculate risk score for a donor using Gemini
 * Returns: { riskScore, riskLevel }
 */
const getDonorRiskScore = async (req, res) => {
  const { id } = req.params;
  try {
    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    const prompt = `Assign a risk score (0-100) and risk level (High Risk, Moderate, Fit to Donate) for this donor. Reply with a JSON object: { riskScore, riskLevel }.\nDonor: ${JSON.stringify(donor)}`;
    const aiResponse = await geminiRequest(prompt);
    let result = { riskScore: 100, riskLevel: 'Fit to Donate' };
    try { result = JSON.parse(aiResponse); } catch {}
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Gemini risk scoring failed' });
  }
};

module.exports = {
  getDonors,
  manualVerifyDonor,
  getDonorRiskScore
};